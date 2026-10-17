<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import {
  CarFront,
  Menu,
  Moon,
  Search,
  ShoppingBag,
  Sparkles,
  Sun,
  UserRound,
  X,
} from 'lucide-vue-next'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import AppFooter from '@/components/layout/AppFooter.vue'
import ErrorBoundary from '@/components/layout/ErrorBoundary.vue'
import PwaStatus from '@/components/layout/PwaStatus.vue'
import AuthModal from '@/components/auth/AuthModal.vue'
import LocationSelector from '@/components/layout/LocationSelector.vue'
import NotificationsDropdown from '@/components/layout/NotificationsDropdown.vue'
import UserMenuDropdown from '@/components/layout/UserMenuDropdown.vue'
import LanguageToggle from '@/components/layout/LanguageToggle.vue'
import SonnerToaster from '@/components/ui/SonnerToaster.vue'
import { useCartStore } from '@/stores/cart'
import { useUiStore } from '@/stores/ui'
import { useAuthStore } from '@/stores/auth'

import { useLocaleStore } from '@/stores/locale'

const route = useRoute()
const cart = useCartStore()
const ui = useUiStore()
const auth = useAuthStore()
const locale = useLocaleStore()
const mobileMenuOpen = ref(false)
const cartLabel = computed(() => (cart.count > 0 ? `${cart.count}` : ''))

/**
 * تبديل السمة مع كشف دائري (View Transitions API) ينطلق من مركز زر التبديل.
 * نحفظ إحداثيات الزر كنِسَب مئوية من أبعاد النافذة، ثم نُطلق الانتقال.
 */
function toggleTheme(event: MouseEvent) {
  const root = document.documentElement

  const button = event.currentTarget as HTMLElement | null
  if (button) {
    const rect = button.getBoundingClientRect()
    const x = ((rect.left + rect.width / 2) / window.innerWidth) * 100
    const y = ((rect.top + rect.height / 2) / window.innerHeight) * 100
    root.style.setProperty('--theme-toggle-x', `${x.toFixed(2)}%`)
    root.style.setProperty('--theme-toggle-y', `${y.toFixed(2)}%`)
  }

  if (typeof document.startViewTransition === 'function') {
    void document.startViewTransition(async () => {
      ui.toggle()
      await nextTick()
    })
  } else {
    ui.toggle()
  }
}

type NavItem = {
  label: string
  to: string | { path: string; query?: Record<string, string> }
  name: string
  activeWhen?: () => boolean
}

const navItems = computed<NavItem[]>(() => [
  { label: locale.t('home'), to: '/', name: 'home' },
  { label: locale.t('products'), to: '/products', name: 'products' },
  { label: locale.t('merchants'), to: '/merchants', name: 'merchants' },
  { label: locale.t('about'), to: '/about', name: 'about' },
])

function isNavActive(item?: NavItem): boolean {
  if (!item) return false
  if (item.activeWhen) return item.activeWhen()
  if (item.name === 'products') return route.name === 'products' || route.name === 'product'
  return route.name === item.name
}
</script>

<template>
  <ErrorBoundary>
    <div
      class="min-h-screen overflow-x-hidden bg-[var(--bg)] text-[var(--text)] transition-colors duration-200"
      :dir="locale.dir"
    >
      <a
        href="#app-content"
        class="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-[#E8A020] focus:px-4 focus:py-3 focus:text-xs focus:font-bold focus:text-[#071F0D]"
        >تخطَّ إلى المحتوى</a
      >

      <header
        class="sticky top-0 z-40 border-b border-[var(--line)] bg-[var(--bg)]/90 backdrop-blur-xl"
      >
        <div class="mx-auto max-w-[1440px] px-3.5 sm:px-8 lg:px-12">
          <!-- Desktop & Tablet Header (sm and up) -->
          <div
            class="relative hidden h-[56px] items-center justify-between border-b border-[var(--line)] sm:flex lg:h-[62px]"
          >
            <!-- RIGHT (in RTL) / LEFT (in LTR): Options & User Actions -->
            <div class="flex items-center gap-1.5 sm:gap-2">
              <!-- Auth: Login button if not logged in, or User Avatar dropdown if logged in -->
              <template v-if="!auth.isLoggedIn">
                <button
                  type="button"
                  class="flex items-center gap-1.5 rounded-lg border border-[var(--line-strong)] bg-[var(--glass)] px-3 py-1.5 text-[12px] font-bold text-[var(--text)] transition hover:border-[#E8A020]/50 hover:text-[#E8A020]"
                  @click="ui.openAuth('login')"
                >
                  <UserRound :size="13" />
                  <span>{{ locale.t('login') }}</span>
                </button>
              </template>
              <template v-else>
                <UserMenuDropdown />
              </template>

              <!-- Notification Bell: ONLY visible when logged in -->
              <NotificationsDropdown v-if="auth.isLoggedIn" />

              <!-- Cart Button with counter badge -->
              <RouterLink
                to="/cart"
                :aria-label="locale.t('cart')"
                class="relative grid h-8 w-8 place-items-center rounded-md border border-[#E8A020]/60 bg-[#E8A020] text-[#071F0D] transition hover:bg-[#F5C060]"
              >
                <ShoppingBag :size="14" stroke-width="2.5" />
                <span
                  v-if="cartLabel"
                  role="status"
                  aria-live="polite"
                  class="absolute -start-1.5 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full border-2 border-[var(--bg)] bg-[#0F3D20] px-1 text-[11px] font-bold text-[var(--text)]"
                >
                  {{ cartLabel }}
                </span>
              </RouterLink>

              <!-- Search Icon -->
              <RouterLink
                to="/search"
                :aria-label="locale.t('search')"
                class="grid h-8 w-8 place-items-center rounded-md border border-[var(--line)] text-[var(--muted)] transition hover:border-[#E8A020]/40 hover:text-[var(--text)]"
              >
                <Search :size="14" />
              </RouterLink>

              <!-- Language Toggle (ع / EN) -->
              <LanguageToggle />

              <!-- Theme Toggle Button (Sun / Moon) -->
              <button
                :aria-label="
                  ui.isLight
                    ? locale.isArabic
                      ? 'التبديل للوضع الداكن'
                      : 'Switch to Dark Mode'
                    : locale.isArabic
                      ? 'التبديل للوضع الفاتح'
                      : 'Switch to Light Mode'
                "
                :title="
                  ui.isLight
                    ? locale.isArabic
                      ? 'التبديل للوضع الداكن'
                      : 'Switch to Dark Mode'
                    : locale.isArabic
                      ? 'التبديل للوضع الفاتح'
                      : 'Switch to Light Mode'
                "
                class="theme-toggle-btn relative grid h-8 w-8 place-items-center overflow-hidden rounded-md border border-[var(--line)] text-[var(--muted)] transition-all duration-300 hover:border-[#E8A020]/50 hover:bg-[#E8A020]/10 hover:text-[#E8A020]"
                @click="toggleTheme"
              >
                <span
                  class="theme-icon absolute inset-0 flex items-center justify-center"
                  :class="ui.isLight ? 'theme-icon--active' : 'theme-icon--hidden-up'"
                  aria-hidden="true"
                >
                  <Sun :size="14" />
                </span>
                <span
                  class="theme-icon absolute inset-0 flex items-center justify-center"
                  :class="ui.isLight ? 'theme-icon--hidden-down' : 'theme-icon--active'"
                  aria-hidden="true"
                >
                  <Moon :size="14" />
                </span>
              </button>
            </div>

            <!-- CENTER: Brand and Logo -->
            <RouterLink to="/" class="absolute left-1/2 flex -translate-x-1/2 items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 64 64"
                class="h-7 w-7 shrink-0"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="logoDropGrad" x1="0" y1="0" x2="0.5" y2="1">
                    <stop offset="0%" stop-color="#FFD659" />
                    <stop offset="50%" stop-color="#E8A020" />
                    <stop offset="100%" stop-color="#B87500" />
                  </linearGradient>
                  <radialGradient id="logoSheen" cx="38%" cy="28%" r="50%">
                    <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.35" />
                    <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0" />
                  </radialGradient>
                </defs>
                <rect width="64" height="64" rx="14" fill="#0F3D20" />
                <path
                  d="M32 6 C32 6,10 30,10 43 C10 55.7,20.2 62,32 62 C43.8 62,54 55.7,54 43 C54 30,32 6,32 6 Z"
                  fill="url(#logoDropGrad)"
                />
                <path
                  d="M32 6 C32 6,10 30,10 43 C10 55.7,20.2 62,32 62 C43.8 62,54 55.7,54 43 C54 30,32 6,32 6 Z"
                  fill="url(#logoSheen)"
                />
                <path
                  d="M18 42 C17 36,21 29,27 23"
                  stroke="white"
                  stroke-width="3.5"
                  stroke-linecap="round"
                  fill="none"
                  opacity="0.42"
                />
              </svg>
              <span class="display-font text-[15px] font-bold text-[#E8A020]">
                ZAYT<span class="text-[var(--text)]">STORE</span>
              </span>
            </RouterLink>

            <!-- LEFT (in RTL) / RIGHT (in LTR): Change Location & Phone Number -->
            <div class="flex items-center gap-2">
              <LocationSelector />
            </div>
          </div>

          <!-- Mobile Header Bar (Screen < sm, fluid & perfectly spaced) -->
          <div
            class="flex h-[52px] items-center justify-between border-b border-[var(--line)] sm:hidden"
          >
            <!-- Start: Logo and Brand -->
            <RouterLink to="/" class="flex items-center gap-1.5 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" class="h-6 w-6 shrink-0">
                <rect width="64" height="64" rx="14" fill="#0F3D20" />
                <path
                  d="M32 6 C32 6,10 30,10 43 C10 55.7,20.2 62,32 62 C43.8 62,54 55.7,54 43 C54 30,32 6,32 6 Z"
                  fill="#E8A020"
                />
              </svg>
              <span class="display-font text-[14px] font-black text-[#E8A020]">
                ZAYT<span class="text-[var(--text)]">STORE</span>
              </span>
            </RouterLink>

            <!-- End: Actions for mobile -->
            <div class="flex items-center gap-1.5">
              <!-- Avatar or Login on mobile -->
              <template v-if="auth.isLoggedIn">
                <UserMenuDropdown />
                <NotificationsDropdown />
              </template>
              <button
                v-else
                type="button"
                class="rounded-lg border border-[var(--line)] bg-[var(--glass)] px-2 py-1 text-[11px] font-bold text-[var(--text)] hover:text-[#E8A020]"
                @click="ui.openAuth('login')"
              >
                {{ locale.t('login') }}
              </button>

              <RouterLink
                to="/cart"
                :aria-label="locale.t('cart')"
                class="relative grid h-7 w-7 place-items-center rounded-md border border-[#E8A020]/60 bg-[#E8A020] text-[#071F0D]"
              >
                <ShoppingBag :size="13" stroke-width="2.5" />
                <span
                  v-if="cartLabel"
                  class="absolute -start-1 -top-1 grid h-3.5 min-w-3.5 place-items-center rounded-full bg-[#0F3D20] px-0.5 text-[9px] font-bold text-[var(--text)]"
                >
                  {{ cartLabel }}
                </span>
              </RouterLink>

              <LanguageToggle />

              <button
                :aria-label="
                  ui.isLight
                    ? locale.isArabic
                      ? 'التبديل للوضع الداكن'
                      : 'Switch to Dark Mode'
                    : locale.isArabic
                      ? 'التبديل للوضع الفاتح'
                      : 'Switch to Light Mode'
                "
                :title="
                  ui.isLight
                    ? locale.isArabic
                      ? 'التبديل للوضع الداكن'
                      : 'Switch to Dark Mode'
                    : locale.isArabic
                      ? 'التبديل للوضع الفاتح'
                      : 'Switch to Light Mode'
                "
                class="theme-toggle-btn relative grid h-7 w-7 place-items-center overflow-hidden rounded-md border border-[var(--line)] text-[var(--muted)] transition-all duration-300 hover:border-[#E8A020]/50 hover:bg-[#E8A020]/10 hover:text-[#E8A020]"
                @click="toggleTheme"
              >
                <span
                  class="theme-icon absolute inset-0 flex items-center justify-center"
                  :class="ui.isLight ? 'theme-icon--active' : 'theme-icon--hidden-up'"
                  aria-hidden="true"
                >
                  <Sun :size="13" />
                </span>
                <span
                  class="theme-icon absolute inset-0 flex items-center justify-center"
                  :class="ui.isLight ? 'theme-icon--hidden-down' : 'theme-icon--active'"
                  aria-hidden="true"
                >
                  <Moon :size="13" />
                </span>
              </button>

              <button
                class="grid h-7 w-7 place-items-center rounded-md border border-[var(--line)] text-[var(--muted)]"
                :aria-expanded="mobileMenuOpen"
                @click="mobileMenuOpen = !mobileMenuOpen"
              >
                <X v-if="mobileMenuOpen" :size="15" />
                <Menu v-else :size="15" />
              </button>
            </div>
          </div>

          <!-- Sub-Navbar: Centered Navigation & افتح متجرك without duplicates -->
          <div class="hidden h-[46px] items-center justify-between lg:flex">
            <nav class="flex flex-1 items-center justify-center gap-8">
              <RouterLink
                v-for="item in navItems"
                :key="item.name"
                :to="item.to"
                class="text-[12px] font-bold tracking-[0.04em] text-[var(--muted)] transition hover:text-[#E8A020]"
                :class="{ 'text-[#E8A020] font-black': isNavActive(item) }"
                :aria-current="isNavActive(item) ? 'page' : undefined"
              >
                {{ item.label }}
              </RouterLink>
            </nav>
            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-xl bg-[#E8A020]/15 px-4 py-1.5 text-[12px] font-bold text-[#E8A020] transition hover:bg-[#E8A020] hover:text-[#071F0D]"
              @click="ui.openAuth('register')"
            >
              <CarFront :size="13" />
              <span>{{ locale.t('openStore') }}</span>
            </button>
          </div>

          <!-- Mobile navigation drawer -->
          <Transition name="mobile-menu">
            <div
              v-if="mobileMenuOpen"
              id="mobile-navigation"
              class="border-t border-[var(--line)] py-3 sm:hidden"
            >
              <!-- Mobile Location & Phone Row -->
              <div
                class="mb-3 px-1 pb-3 border-b border-[var(--line)] flex items-center justify-between"
              >
                <LocationSelector />
                <span class="text-[11px] text-[var(--muted)]">{{
                  locale.isArabic ? 'موقع التوصيل' : 'Delivery City'
                }}</span>
              </div>

              <nav class="grid grid-cols-2 gap-1.5">
                <RouterLink
                  v-for="item in navItems"
                  :key="item.name"
                  :to="item.to"
                  class="rounded-xl px-3 py-2.5 text-xs font-bold text-[var(--soft)] transition-colors hover:bg-[var(--glass)]"
                  :class="{ 'bg-[#E8A020]/10 text-[#E8A020]': isNavActive(item) }"
                  @click="mobileMenuOpen = false"
                >
                  {{ item.label }}
                </RouterLink>

                <button
                  v-if="!auth.isLoggedIn"
                  type="button"
                  class="rounded-xl px-3 py-2.5 text-start text-xs font-bold text-[var(--soft)] hover:bg-[var(--glass)] transition-colors"
                  @click="
                    mobileMenuOpen = false
                    ui.openAuth('login')
                  "
                >
                  {{ locale.t('login') }}
                </button>
                <RouterLink
                  v-else
                  to="/profile"
                  class="rounded-xl px-3 py-2.5 text-start text-xs font-bold text-[var(--soft)] hover:bg-[var(--glass)] transition-colors"
                  @click="mobileMenuOpen = false"
                >
                  {{ locale.t('profile') }}
                </RouterLink>

                <button
                  type="button"
                  class="rounded-xl bg-[#E8A020]/15 px-3 py-2.5 text-start text-xs font-bold text-[#E8A020] hover:bg-[#E8A020]/25 transition-colors"
                  @click="
                    mobileMenuOpen = false
                    ui.openAuth('register')
                  "
                >
                  {{ locale.t('openStore') }}
                </button>
              </nav>
            </div>
          </Transition>
        </div>
      </header>

      <main id="app-content" class="mx-auto max-w-[1440px] px-4 pb-28 sm:px-8 lg:px-12 lg:pb-12">
        <RouterView v-slot="{ Component }">
          <Transition name="fade" mode="out-in">
            <component :is="Component" />
          </Transition>
        </RouterView>
      </main>

      <AppFooter />
      <PwaStatus />
      <AuthModal />
      <SonnerToaster />

      <!-- Fixed Mobile Bottom Navigation -->
      <nav
        class="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--line)] bg-[var(--panel)]/95 px-4 pb-[max(10px,env(safe-area-inset-bottom))] pt-2.5 backdrop-blur-xl sm:hidden"
      >
        <div class="mx-auto flex max-w-md items-center justify-around">
          <RouterLink
            to="/"
            class="flex flex-col items-center gap-1 text-[11px] font-bold text-[var(--muted)]"
            :class="{ 'text-[#E8A020]': route.name === 'home' }"
          >
            <Sparkles :size="18" />
            <span>{{ locale.t('home') }}</span>
          </RouterLink>

          <RouterLink
            to="/products"
            class="flex flex-col items-center gap-1 text-[11px] font-bold text-[var(--muted)]"
            :class="{ 'text-[#E8A020]': route.name === 'products' || route.name === 'product' }"
          >
            <Search :size="18" />
            <span>{{ locale.t('products') }}</span>
          </RouterLink>

          <RouterLink
            to="/cart"
            class="relative flex flex-col items-center gap-1 text-[11px] font-bold text-[var(--muted)]"
            :class="{ 'text-[#E8A020]': route.name === 'cart' }"
          >
            <ShoppingBag :size="18" />
            <span>{{ locale.t('cart') }}</span>
            <span
              v-if="cartLabel"
              class="absolute -end-2 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-[#E8A020] px-1 text-[10px] font-extrabold text-[#071F0D]"
            >
              {{ cartLabel }}
            </span>
          </RouterLink>

          <RouterLink
            v-if="auth.isLoggedIn"
            to="/profile"
            class="flex flex-col items-center gap-1 text-[11px] font-bold text-[var(--muted)]"
            :class="{ 'text-[#E8A020]': route.name === 'profile' || route.name === 'garage' }"
          >
            <UserRound :size="18" />
            <span>{{ locale.t('account') }}</span>
          </RouterLink>
          <button
            v-else
            type="button"
            class="flex flex-col items-center gap-1 text-[11px] font-bold text-[var(--muted)]"
            @click="ui.openAuth('login')"
          >
            <UserRound :size="18" />
            <span>{{ locale.t('login') }}</span>
          </button>
        </div>
      </nav>
    </div>
  </ErrorBoundary>
</template>

<style scoped>
.mobile-menu-enter-active {
  transition:
    opacity 240ms cubic-bezier(0.16, 1, 0.3, 1),
    transform 240ms cubic-bezier(0.16, 1, 0.3, 1);
  transform-origin: top;
}
.mobile-menu-leave-active {
  transition:
    opacity 180ms ease,
    transform 180ms ease;
  transform-origin: top;
}
.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-8px) scaleY(0.96);
}
</style>

<script setup lang="ts">
import {
  ChevronLeft,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Send,
} from 'lucide-vue-next'
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { categories } from '@/data/categories'
import { useLocaleStore } from '@/stores/locale'

const locale = useLocaleStore()

// Safe translation helper
function tr(key: string) {
  if (locale && typeof locale.t === 'function') {
    return locale.t(key)
  }
  return key
}

const email = ref('')
const subscribed = ref(false)
const currentYear = new Date().getFullYear()

const contactEmail = 'zaytstore.hass@gmail.com'
const socials = [
  { label: 'فيسبوك', href: 'https://www.facebook.com/61563855245885', icon: Facebook },
  { label: 'واتساب', href: 'https://wa.me/963983229062', icon: MessageCircle },
  { label: 'تيليجرام', href: 'https://t.me/zaytstore', icon: Send },
  { label: 'انستغرام', href: 'https://instagram.com/zaytstore', icon: Instagram },
]

function subscribe() {
  if (!email.value.trim()) return
  subscribed.value = true
}
</script>

<template>
  <footer
    class="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 pb-24 sm:pb-8 text-[var(--text)] transition-colors"
    :dir="locale.dir"
  >
    <div
      class="grid grid-cols-2 md:grid-cols-[minmax(0,1.62fr)_minmax(116px,0.54fr)_minmax(210px,1fr)] gap-2.5 md:gap-[18px] mb-3 md:mb-6"
    >
      <a
        :href="`mailto:${contactEmail}`"
        class="col-span-2 md:col-span-1 relative flex min-h-[90px] md:min-h-[105px] flex-col justify-between overflow-hidden border border-[var(--line-strong)] rounded-2xl bg-[var(--panel)] px-4 py-3 md:px-5 md:py-4 no-underline transition hover:border-[#E8A020]/65 hover:bg-[var(--panel)] group"
      >
        <span
          class="relative flex items-center gap-1.5 text-[var(--text)] text-[11px] font-semibold uppercase"
        >
          <Mail :size="12" class="text-[#E8A020]" />
          <span>{{ locale.isArabic ? 'البريد الإلكتروني' : 'Email Address' }}</span>
        </span>
        <strong
          class="relative text-[#E8A020] font-mono text-[13px] md:text-[15px] font-semibold tracking-[0.02em]"
          dir="ltr"
        >
          {{ contactEmail }}
        </strong>
      </a>

      <div
        class="relative flex min-h-[90px] md:min-h-[105px] flex-col justify-between overflow-hidden border border-[var(--line-strong)] rounded-2xl bg-[var(--panel)] px-4 py-3 md:px-5 md:py-4 transition hover:border-[#E8A020]/65 hover:bg-[var(--panel)]"
      >
        <span class="relative text-[var(--text)] text-[11px] font-semibold uppercase">
          {{ tr('followUs') }}
        </span>
        <div
          class="flex items-center gap-3 text-[#E8A020]"
          :aria-label="locale.isArabic ? 'حساباتنا على مواقع التواصل' : 'Our Social Media'"
        >
          <a
            v-for="social in socials"
            :key="social.label"
            :href="social.href"
            target="_blank"
            rel="noreferrer"
            :aria-label="social.label"
            :title="social.label"
            class="inline-flex items-center justify-center text-inherit no-underline transition hover:text-[#F5C060] hover:-translate-y-[1px]"
          >
            <component :is="social.icon" :size="16" :stroke-width="2.5" />
          </a>
        </div>
      </div>

      <div
        class="relative flex min-h-[90px] md:min-h-[105px] flex-col justify-between overflow-hidden border border-[var(--line-strong)] rounded-2xl bg-[var(--panel)] px-4 py-3 md:px-5 md:py-4 transition hover:border-[#E8A020]/65 hover:bg-[var(--panel)]"
      >
        <span
          class="relative flex items-center gap-1.5 text-[var(--text)] text-[11px] font-semibold uppercase"
        >
          <MapPin :size="12" class="text-[#E8A020]" />
          <span>{{ tr('coverage') }}</span>
        </span>
        <strong
          class="relative text-[#E8A020] text-[13px] md:text-[14px] font-bold tracking-[0.02em]"
        >
          {{ tr('governoratesCount') }}
        </strong>
      </div>
    </div>

    <!-- Main Footer Card -->
    <div
      class="min-h-[265px] overflow-hidden rounded-[20px] md:rounded-[36px] border border-[var(--line)] bg-[var(--elevated)] p-6 md:p-8"
    >
      <div
        class="grid grid-cols-1 md:grid-cols-[minmax(0,340px)_1fr] justify-between gap-8 md:gap-14"
      >
        <!-- Newsletter Subscription -->
        <div>
          <h2 class="display-font mb-3 text-[16px] font-bold text-[var(--text)] m-0">
            {{ tr('newsletterTitle') }}
          </h2>
          <form
            v-if="!subscribed"
            class="flex max-w-[340px] items-center border-b border-[var(--line-strong)] pb-1"
            @submit.prevent="subscribe"
          >
            <label class="sr-only" for="footer-email">{{ tr('newsletterPlaceholder') }}</label>
            <input
              id="footer-email"
              v-model="email"
              required
              type="email"
              :placeholder="tr('newsletterPlaceholder')"
              class="min-w-0 h-[32px] flex-1 border-0 outline-none bg-transparent text-[var(--text)] text-[13px] placeholder:text-[var(--muted)]"
            />
            <button
              type="submit"
              :aria-label="locale.isArabic ? 'اشتراك' : 'Subscribe'"
              class="grid h-[28px] w-[36px] place-items-center rounded-xl border border-[#E8A020]/40 bg-[#E8A020]/15 text-[#E8A020] transition hover:bg-[#E8A020] hover:text-[#071F0D]"
            >
              <ChevronLeft :size="16" :class="{ 'rotate-180': locale.isEnglish }" />
            </button>
          </form>
          <p v-else class="text-[#E8A020] text-[12px] font-bold">
            {{
              locale.isArabic
                ? 'شكراً لك! تم اشتراكك بنجاح في النشرة البريدية.'
                : 'Thank you! You have subscribed to our newsletter.'
            }}
          </p>
          <label class="flex items-center gap-1.5 mt-2 text-[var(--muted)] text-[11px]">
            <input type="checkbox" required class="h-3 w-3 m-0 accent-[#E8A020] rounded" />
            <span>{{
              locale.isArabic
                ? 'أوافق على سياسة الخصوصية والشروط'
                : 'I agree to the privacy policy and terms'
            }}</span>
          </label>
        </div>

        <!-- Links Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-6 text-start">
          <div>
            <p class="m-0 mb-3 text-[var(--text)] text-[12px] font-bold uppercase tracking-wider">
              ZaytStore
            </p>
            <nav class="flex flex-col gap-2">
              <RouterLink
                to="/about"
                class="text-[var(--muted)] text-[12px] no-underline transition hover:text-[#E8A020]"
                >{{ tr('about') }}</RouterLink
              >
              <RouterLink
                to="/merchants"
                class="text-[var(--muted)] text-[12px] no-underline transition hover:text-[#E8A020]"
                >{{ tr('merchants') }}</RouterLink
              >
              <RouterLink
                to="/privacy"
                class="text-[var(--muted)] text-[12px] no-underline transition hover:text-[#E8A020]"
                >{{ tr('privacy') }}</RouterLink
              >
              <RouterLink
                to="/terms"
                class="text-[var(--muted)] text-[12px] no-underline transition hover:text-[#E8A020]"
                >{{ tr('terms') }}</RouterLink
              >
            </nav>
          </div>

          <div>
            <p class="m-0 mb-3 text-[var(--text)] text-[12px] font-bold uppercase tracking-wider">
              {{ tr('products') }}
            </p>
            <nav class="flex flex-col gap-2">
              <RouterLink
                v-for="category in categories.slice(1, 5)"
                :key="category.slug"
                :to="`/products?category=${category.slug}`"
                class="text-[var(--muted)] text-[12px] no-underline transition hover:text-[#E8A020]"
              >
                {{ category.label }}
              </RouterLink>
            </nav>
          </div>

          <div>
            <p class="m-0 mb-3 text-[var(--text)] text-[12px] font-bold uppercase tracking-wider">
              {{ locale.isArabic ? 'للتجار' : 'For Merchants' }}
            </p>
            <nav class="flex flex-col gap-2">
              <RouterLink
                to="/register"
                class="text-[var(--muted)] text-[12px] no-underline transition hover:text-[#E8A020]"
                >{{ tr('openStore') }}</RouterLink
              >
              <RouterLink
                to="/merchants"
                class="text-[var(--muted)] text-[12px] no-underline transition hover:text-[#E8A020]"
                >{{ locale.isArabic ? 'دليل التجار' : 'Merchant Directory' }}</RouterLink
              >
            </nav>
          </div>

          <div>
            <p class="m-0 mb-3 text-[var(--text)] text-[12px] font-bold uppercase tracking-wider">
              {{ locale.isArabic ? 'المساعدة' : 'Support' }}
            </p>
            <nav class="flex flex-col gap-2">
              <RouterLink
                to="/help"
                class="text-[var(--muted)] text-[12px] no-underline transition hover:text-[#E8A020]"
                >{{ tr('help') }}</RouterLink
              >
              <a
                :href="`mailto:${contactEmail}`"
                class="text-[var(--muted)] text-[12px] no-underline transition hover:text-[#E8A020]"
                >{{ tr('contactUs') }}</a
              >
            </nav>
          </div>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="flex flex-col items-center mt-10 md:mt-14 border-t border-[var(--line)] pt-6">
        <RouterLink
          to="/"
          class="text-[#E8A020] text-[16px] font-black tracking-wider no-underline"
        >
          ZAYT<span class="text-[var(--text)]">STORE</span>
        </RouterLink>
        <div
          class="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 mt-2 text-[var(--muted)] text-[11px] text-center"
        >
          <span>© {{ currentYear }} ZaytStore — {{ tr('allRightsReserved') }}</span>
          <RouterLink to="/privacy" class="text-inherit no-underline hover:text-[var(--text)]">{{
            tr('privacy')
          }}</RouterLink>
          <RouterLink to="/terms" class="text-inherit no-underline hover:text-[var(--text)]">{{
            tr('terms')
          }}</RouterLink>
          <RouterLink to="/about" class="text-inherit no-underline hover:text-[var(--text)]">{{
            tr('about')
          }}</RouterLink>
        </div>
      </div>
    </div>
  </footer>
</template>

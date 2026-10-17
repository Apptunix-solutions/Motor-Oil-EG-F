<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import {
  Bell,
  CheckCheck,
  ChevronLeft,
  LogOut,
  MapPin,
  Package,
  Plus,
  Save,
  Settings,
  ShieldCheck,
  Sparkles,
  Trash2,
  Truck,
  UserRound,
  Wrench,
} from 'lucide-vue-next'
import { formatPrice } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth'
import { useLocaleStore } from '@/stores/locale'
import { useOrdersStore } from '@/stores/orders'
import { useNotificationsStore } from '@/stores/notifications'
import { useVehicleStore } from '@/stores/vehicle'
import { useWishlistStore } from '@/stores/wishlist'
import { toast } from '@/lib/toast'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const locale = useLocaleStore()
const vehicle = useVehicleStore()
const orders = useOrdersStore()
const wishlist = useWishlistStore()
const notifications = useNotificationsStore()

type TabKey = 'overview' | 'orders' | 'garage' | 'addresses' | 'notifications' | 'settings'

const activeTab = ref<TabKey>('overview')

watch(
  () => route.query.tab,
  (tab) => {
    if (
      tab &&
      ['overview', 'orders', 'garage', 'addresses', 'notifications', 'settings'].includes(
        tab as string,
      )
    ) {
      activeTab.value = tab as TabKey
    } else {
      activeTab.value = 'overview'
    }
  },
  { immediate: true },
)

function switchTab(tab: TabKey) {
  activeTab.value = tab
  router.replace({ query: { ...route.query, tab } })
}

/* Edit profile form state */
const formName = ref(auth.user?.name || (locale.isArabic ? 'عمر حسن الخالد' : 'Omar Hassan'))
const formEmail = ref(auth.user?.email || 'omar.khalid@gmail.com')
const formPhone = ref(auth.user?.phone || '0944 123 456')
const formCity = ref(auth.user?.location || auth.selectedLocation)

function handleSaveProfile() {
  auth.updateProfile({
    name: formName.value,
    email: formEmail.value,
    phone: formPhone.value,
    location: formCity.value,
  })
  auth.setLocation(formCity.value)
  toast.success(
    locale.isArabic ? 'تم حفظ التعديلات بنجاح' : 'Profile updated successfully',
    locale.isArabic ? 'تم تحديث بيانات ملفك الشخصي' : 'Your profile details have been saved',
  )
}

/* Sample saved addresses */
const savedAddresses = ref([
  {
    id: 1,
    title: locale.isArabic ? 'المنزل - دمشق' : 'Home - Damascus',
    city: 'دمشق',
    details: locale.isArabic
      ? 'المزة - فيلات غربية، جانب جامع الأكرم، بناية السعادة، طابق 2'
      : 'Mazzeh West Villas, near Al-Akram Mosque, Bldg 4, 2nd Floor',
    isDefault: true,
  },
  {
    id: 2,
    title: locale.isArabic ? 'العمل / الورشة' : 'Work / Workshop',
    city: 'ريف دمشق',
    details: locale.isArabic
      ? 'المنطقة الصناعية بحوش بلاس، شارع 14، مركز صيانة النور'
      : 'Housh Blass Industrial Area, St. 14, Al-Noor Auto Center',
    isDefault: false,
  },
])

function setDefaultAddress(id: number) {
  savedAddresses.value.forEach((a) => (a.isDefault = a.id === id))
  toast.success(
    locale.isArabic
      ? 'تم تعيين العنوان كعنوان افتراضي للتوصيل'
      : 'Default delivery address updated',
  )
}

function handleLogout() {
  auth.logout()
  toast.info(locale.isArabic ? 'تم تسجيل الخروج بنجاح' : 'Logged out successfully')
  router.push('/')
}
</script>

<template>
  <div class="pb-16 pt-6 sm:pt-10" :dir="locale.dir">
    <!-- Header -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex items-center gap-3.5 sm:gap-4">
        <div
          class="relative grid h-14 w-14 sm:h-16 sm:w-16 shrink-0 place-items-center rounded-2xl border-2 border-[#E8A020]/40 overflow-hidden bg-[#0F3D20]"
        >
          <img
            v-if="auth.user?.avatar"
            :src="auth.user.avatar"
            :alt="auth.user.name"
            class="h-full w-full object-cover"
          />
          <UserRound v-else :size="26" class="text-[#E8A020]" />
        </div>
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-2">
            <span
              class="rounded-md bg-[#E8A020]/15 px-2 py-0.5 text-[11px] font-bold text-[#E8A020]"
            >
              {{
                auth.user?.role === 'merchant'
                  ? locale.isArabic
                    ? 'تاجر معتمد'
                    : 'Verified Merchant'
                  : locale.isArabic
                    ? 'زبون موثق'
                    : 'Verified Customer'
              }}
            </span>
            <span class="text-xs text-[var(--muted)]">
              {{ locale.isArabic ? 'عضو منذ 2024' : 'Member since 2024' }}
            </span>
          </div>
          <h1
            class="display-font mt-1 text-xl sm:text-2xl lg:text-3xl font-bold text-[var(--text)] truncate"
          >
            {{ locale.isArabic ? 'أهلاً، ' : 'Welcome, '
            }}{{ auth.user?.name || (locale.isArabic ? 'بك' : 'User')
            }}<span class="text-[#E8A020]">.</span>
          </h1>
          <p class="text-xs text-[var(--muted)] truncate">
            {{ auth.user?.email || auth.user?.phone }} · {{ locale.isArabic ? 'مدينة' : 'City' }}
            {{ auth.selectedLocation }}
          </p>
        </div>
      </div>

      <button
        type="button"
        class="inline-flex self-start sm:self-auto items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-3.5 py-2 text-xs font-bold text-red-400 transition hover:bg-red-500/15"
        @click="handleLogout"
      >
        <LogOut :size="14" />
        <span>{{ locale.isArabic ? 'تسجيل الخروج' : 'Log Out' }}</span>
      </button>
    </div>

    <!-- Navigation Tabs (Horizontally scrollable with smooth touch on mobile) -->
    <div
      class="mt-6 sm:mt-8 -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto border-b border-[var(--line)] pb-3 scrollbar-none flex gap-2"
    >
      <button
        type="button"
        class="inline-flex shrink-0 items-center gap-2 rounded-xl px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs font-bold transition whitespace-nowrap"
        :class="
          activeTab === 'overview'
            ? 'bg-[#E8A020] text-[#071F0D] shadow-md shadow-[#E8A020]/20'
            : 'border border-[var(--line)] bg-[var(--glass)] text-[var(--muted)] hover:text-[var(--text)]'
        "
        @click="switchTab('overview')"
      >
        <Sparkles :size="14" />
        <span>{{ locale.isArabic ? 'نظرة عامة' : 'Overview' }}</span>
      </button>

      <button
        type="button"
        class="inline-flex shrink-0 items-center gap-2 rounded-xl px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs font-bold transition whitespace-nowrap"
        :class="
          activeTab === 'orders'
            ? 'bg-[#E8A020] text-[#071F0D] shadow-md shadow-[#E8A020]/20'
            : 'border border-[var(--line)] bg-[var(--glass)] text-[var(--muted)] hover:text-[var(--text)]'
        "
        @click="switchTab('orders')"
      >
        <Package :size="14" />
        <span>{{
          locale.isArabic ? `طلباتي (${orders.orders.length})` : `Orders (${orders.orders.length})`
        }}</span>
      </button>

      <button
        type="button"
        class="inline-flex shrink-0 items-center gap-2 rounded-xl px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs font-bold transition whitespace-nowrap"
        :class="
          activeTab === 'garage'
            ? 'bg-[#E8A020] text-[#071F0D] shadow-md shadow-[#E8A020]/20'
            : 'border border-[var(--line)] bg-[var(--glass)] text-[var(--muted)] hover:text-[var(--text)]'
        "
        @click="switchTab('garage')"
      >
        <Wrench :size="14" />
        <span>{{ locale.isArabic ? 'كراجي وسياراتي' : 'My Garage' }}</span>
      </button>

      <button
        type="button"
        class="inline-flex shrink-0 items-center gap-2 rounded-xl px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs font-bold transition whitespace-nowrap"
        :class="
          activeTab === 'notifications'
            ? 'bg-[#E8A020] text-[#071F0D] shadow-md shadow-[#E8A020]/20'
            : 'border border-[var(--line)] bg-[var(--glass)] text-[var(--muted)] hover:text-[var(--text)]'
        "
        @click="switchTab('notifications')"
      >
        <Bell :size="14" />
        <span>{{ locale.isArabic ? 'الإشعارات' : 'Notifications' }}</span>
        <span
          v-if="notifications.unreadCount > 0"
          class="rounded-full bg-red-500 px-1.5 py-0.2 text-[10px] font-black text-white"
        >
          {{ notifications.unreadCount }}
        </span>
      </button>

      <button
        type="button"
        class="inline-flex shrink-0 items-center gap-2 rounded-xl px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs font-bold transition whitespace-nowrap"
        :class="
          activeTab === 'addresses'
            ? 'bg-[#E8A020] text-[#071F0D] shadow-md shadow-[#E8A020]/20'
            : 'border border-[var(--line)] bg-[var(--glass)] text-[var(--muted)] hover:text-[var(--text)]'
        "
        @click="switchTab('addresses')"
      >
        <MapPin :size="14" />
        <span>{{ locale.isArabic ? 'عناوين التوصيل' : 'Addresses' }}</span>
      </button>

      <button
        type="button"
        class="inline-flex shrink-0 items-center gap-2 rounded-xl px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs font-bold transition whitespace-nowrap"
        :class="
          activeTab === 'settings'
            ? 'bg-[#E8A020] text-[#071F0D] shadow-md shadow-[#E8A020]/20'
            : 'border border-[var(--line)] bg-[var(--glass)] text-[var(--muted)] hover:text-[var(--text)]'
        "
        @click="switchTab('settings')"
      >
        <Settings :size="14" />
        <span>{{ locale.isArabic ? 'إعدادات الحساب' : 'Settings' }}</span>
      </button>
    </div>

    <!-- TAB 1: OVERVIEW -->
    <div v-if="activeTab === 'overview'" class="mt-6 sm:mt-8 space-y-6 sm:space-y-8">
      <div class="grid gap-4 sm:gap-5 lg:grid-cols-2">
        <!-- Vehicle Card -->
        <div
          class="rounded-2xl sm:rounded-[24px] border border-[#E8A020]/20 bg-[#E8A020]/[0.06] p-5 sm:p-6"
        >
          <div class="flex items-start justify-between">
            <div>
              <p class="text-[12px] font-bold uppercase text-[#E8A020]">
                {{ locale.isArabic ? 'سيارتك المسجلة' : 'Registered Vehicle' }}
              </p>
              <h2
                v-if="vehicle.vehicle"
                class="display-font mt-2 text-xl sm:text-2xl font-bold text-[var(--text)]"
              >
                {{ vehicle.vehicle.make }} {{ vehicle.vehicle.model }}
              </h2>
              <h2 v-else class="display-font mt-2 text-xl sm:text-2xl font-bold text-[var(--text)]">
                {{ locale.isArabic ? 'أضف سيارتك' : 'Add Your Vehicle' }}
              </h2>
              <p v-if="vehicle.vehicle" class="mt-1 text-xs text-[var(--muted)]">
                {{ locale.isArabic ? 'سنة الصنع: ' : 'Year: ' }}{{ vehicle.vehicle.year }} ·
                {{ locale.isArabic ? 'المحرك: ' : 'Engine: ' }}{{ vehicle.vehicle.engine }}
              </p>
              <p v-else class="mt-2 text-xs sm:text-sm text-[var(--muted)]">
                {{
                  locale.isArabic
                    ? 'احصل على توصيات فورية لزيوت وفلاتر تناسب محركك بدقة.'
                    : 'Get instant recommendations for oils and filters matching your exact engine.'
                }}
              </p>
            </div>
            <div
              class="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#E8A020]/15 text-[#E8A020]"
            >
              <ShieldCheck :size="20" />
            </div>
          </div>
          <RouterLink
            to="/garage/add"
            class="mt-5 sm:mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-[#E8A020] hover:text-[#F5C060]"
          >
            <span>{{
              vehicle.vehicle
                ? locale.isArabic
                  ? 'تعديل بيانات السيارة'
                  : 'Edit vehicle details'
                : locale.isArabic
                  ? 'إضافة سيارة جديدة الآن'
                  : 'Add new vehicle now'
            }}</span>
            <ChevronLeft :size="14" :class="{ 'rotate-180': locale.isEnglish }" />
          </RouterLink>
        </div>

        <!-- Quick Stats -->
        <div
          class="rounded-2xl sm:rounded-[24px] border border-[var(--line)] bg-[var(--panel)] p-5 sm:p-6"
        >
          <p class="text-[12px] font-bold uppercase text-[var(--muted)]">
            {{ locale.isArabic ? 'ملخص النشاط في المنصة' : 'Platform Activity Summary' }}
          </p>
          <div class="mt-4 sm:mt-5 grid grid-cols-3 gap-2.5 sm:gap-4 text-center">
            <div
              class="rounded-xl sm:rounded-2xl border border-[var(--line)] bg-[var(--glass)] p-3"
            >
              <p class="display-font text-2xl sm:text-3xl font-extrabold text-[var(--text)]">
                {{ orders.orders.length }}
              </p>
              <p class="mt-1 text-[10px] sm:text-[11px] text-[var(--muted)]">
                {{ locale.isArabic ? 'إجمالي الطلبات' : 'Total Orders' }}
              </p>
            </div>
            <div
              class="rounded-xl sm:rounded-2xl border border-[var(--line)] bg-[var(--glass)] p-3"
            >
              <p class="display-font text-2xl sm:text-3xl font-extrabold text-[#E8A020]">
                {{ wishlist.count }}
              </p>
              <p class="mt-1 text-[10px] sm:text-[11px] text-[var(--muted)]">
                {{ locale.isArabic ? 'المفضلة' : 'Wishlist' }}
              </p>
            </div>
            <div
              class="rounded-xl sm:rounded-2xl border border-[var(--line)] bg-[var(--glass)] p-3"
            >
              <p class="display-font text-2xl sm:text-3xl font-extrabold text-emerald-400">
                {{ savedAddresses.length }}
              </p>
              <p class="mt-1 text-[10px] sm:text-[11px] text-[var(--muted)]">
                {{ locale.isArabic ? 'عناوين مسجلة' : 'Addresses' }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 2: ORDERS -->
    <div v-else-if="activeTab === 'orders'" class="mt-6 sm:mt-8 space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h2 class="text-base sm:text-lg font-bold text-[var(--text)]">
          {{ locale.isArabic ? 'سجل الطلبات والتتبع' : 'Orders History & Tracking' }}
        </h2>
        <RouterLink
          to="/products"
          class="text-xs font-bold text-[#E8A020] hover:underline self-start sm:self-auto"
        >
          {{ locale.isArabic ? 'تسوق المزيد من المنتجات' : 'Shop more products' }}
        </RouterLink>
      </div>

      <div
        v-if="orders.orders.length === 0"
        class="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-8 sm:p-12 text-center"
      >
        <Package :size="36" class="mx-auto text-[var(--muted)]" />
        <h3 class="mt-3 text-base font-bold text-[var(--text)]">
          {{ locale.isArabic ? 'لا توجد طلبات سابقة بعد' : 'No previous orders yet' }}
        </h3>
        <p class="mt-1 text-xs text-[var(--muted)]">
          {{
            locale.isArabic
              ? 'استكشف أفضل أنواع الزيوت ومصنعي الفلاتر المعتمدين في سوريا.'
              : 'Explore premium oils and certified filter brands in Syria.'
          }}
        </p>
        <RouterLink
          to="/products"
          class="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#E8A020] px-5 py-2.5 text-xs font-bold text-[#071F0D]"
        >
          {{ locale.isArabic ? 'تصفح المنتجات الآن' : 'Browse Products Now' }}
        </RouterLink>
      </div>

      <div v-else class="space-y-3.5 sm:space-y-4">
        <div
          v-for="order in orders.orders"
          :key="order.id"
          class="rounded-2xl sm:rounded-[20px] border border-[var(--line)] bg-[var(--panel)] p-4 sm:p-5 transition hover:border-[#E8A020]/40"
        >
          <div
            class="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--line)] pb-4"
          >
            <div>
              <div class="flex items-center gap-2">
                <span class="font-mono text-sm font-extrabold text-[var(--text)]">{{
                  order.id
                }}</span>
                <span
                  class="rounded-full bg-[#E8A020]/15 px-2.5 py-0.5 text-[11px] font-bold text-[#E8A020]"
                >
                  {{ order.status }}
                </span>
              </div>
              <p class="mt-1 text-xs text-[var(--muted)]">
                {{ locale.isArabic ? 'تاريخ الطلب: ' : 'Order Date: '
                }}{{
                  new Date(order.createdAt).toLocaleDateString(locale.isArabic ? 'ar-SY' : 'en-US')
                }}
                · {{ order.itemCount }} {{ locale.isArabic ? 'عناصر' : 'items' }}
              </p>
            </div>
            <strong class="text-base text-[#E8A020]">{{ formatPrice(order.total) }}</strong>
          </div>

          <div class="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <span class="flex items-center gap-1.5 text-[var(--muted)]">
              <Truck :size="15" class="text-emerald-400 shrink-0" />
              <span>{{
                locale.isArabic
                  ? `التوصيل إلى ${auth.selectedLocation} خلال 24 - 48 ساعة`
                  : `Delivery to ${auth.selectedLocation} within 24 - 48 hrs`
              }}</span>
            </span>
            <button
              type="button"
              class="font-bold text-[#E8A020] hover:underline self-start sm:self-auto"
              @click="
                toast.info(
                  locale.isArabic
                    ? 'جاري تتبع الشحنة مع شركة التوصيل المحلية'
                    : 'Tracking shipment with local courier',
                )
              "
            >
              {{ locale.isArabic ? 'تتبع الشحنة' : 'Track Order' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 3: GARAGE -->
    <div v-else-if="activeTab === 'garage'" class="mt-6 sm:mt-8 space-y-5 sm:space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 class="text-base sm:text-lg font-bold text-[var(--text)]">
            {{ locale.isArabic ? 'كراجي وسياراتي' : 'My Garage & Vehicles' }}
          </h2>
          <p class="text-xs text-[var(--muted)]">
            {{
              locale.isArabic
                ? 'احفظ بيانات سيارتك للحصول على لزوجة الزيت وكمية التعبئة الدقيقة'
                : 'Save vehicle specs to get exact oil viscosity and capacity recommendations'
            }}
          </p>
        </div>
        <RouterLink
          to="/garage/add"
          class="inline-flex self-start sm:self-auto items-center gap-1.5 rounded-xl bg-[#E8A020] px-4 py-2 text-xs font-bold text-[#071F0D]"
        >
          <Plus :size="14" />
          <span>{{ locale.isArabic ? 'إضافة سيارة' : 'Add Vehicle' }}</span>
        </RouterLink>
      </div>

      <div
        class="rounded-2xl sm:rounded-[24px] border border-[var(--line)] bg-[var(--panel)] p-5 sm:p-6"
      >
        <div
          v-if="vehicle.vehicle"
          class="flex flex-col sm:flex-row sm:items-start justify-between gap-4"
        >
          <div>
            <span
              class="rounded-md bg-emerald-500/15 px-2 py-0.5 text-[11px] font-bold text-emerald-400"
            >
              {{ locale.isArabic ? 'السيارة الحالية' : 'Current Vehicle' }}
            </span>
            <h3 class="display-font mt-2 text-xl sm:text-2xl font-bold text-[var(--text)]">
              {{ vehicle.vehicle.make }} {{ vehicle.vehicle.model }} ({{ vehicle.vehicle.year }})
            </h3>
            <div class="mt-3 flex flex-wrap gap-2 sm:gap-3 text-xs text-[var(--muted)]">
              <span class="rounded-lg bg-[var(--glass)] px-3 py-1 border border-[var(--line)]">
                {{ locale.isArabic ? 'المحرك: ' : 'Engine: '
                }}<strong class="text-[var(--text)]">{{ vehicle.vehicle.engine }}</strong>
              </span>
              <span class="rounded-lg bg-[var(--glass)] px-3 py-1 border border-[var(--line)]">
                {{ locale.isArabic ? 'اللزوجة الموصى بها: ' : 'Recommended Viscosity: '
                }}<strong class="text-[#E8A020]">5W-30 / 5W-40</strong>
              </span>
              <span class="rounded-lg bg-[var(--glass)] px-3 py-1 border border-[var(--line)]">
                {{ locale.isArabic ? 'سعة التعبئة مع الفلتر: ' : 'Capacity w/ Filter: '
                }}<strong class="text-[var(--text)]">4.2 L</strong>
              </span>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-8">
          <p class="text-sm font-semibold text-[var(--muted)]">
            {{ locale.isArabic ? 'لم تقم بإضافة سيارة بعد.' : 'No vehicle added yet.' }}
          </p>
          <RouterLink
            to="/garage/add"
            class="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#E8A020]"
          >
            <span>{{ locale.isArabic ? 'إضافة سيارة الآن' : 'Add vehicle now' }}</span>
            <ChevronLeft :size="14" :class="{ 'rotate-180': locale.isEnglish }" />
          </RouterLink>
        </div>
      </div>
    </div>

    <!-- TAB 4: NOTIFICATIONS -->
    <div v-else-if="activeTab === 'notifications'" class="mt-6 sm:mt-8 space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 class="text-base sm:text-lg font-bold text-[var(--text)]">
            {{ locale.isArabic ? 'مركز الإشعارات والتنبيهات' : 'Notifications & Alerts Center' }}
          </h2>
          <p class="text-xs text-[var(--muted)]">
            {{
              locale.isArabic
                ? 'متابعة حالة الطلبات، مواعيد تغيير الزيت، وتخفيضات التجار'
                : 'Track orders, oil change reminders, and merchant discounts'
            }}
          </p>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <button
            v-if="notifications.unreadCount > 0"
            type="button"
            class="inline-flex items-center gap-1.5 rounded-xl border border-[var(--line)] bg-[var(--glass)] px-3 py-1.5 text-xs font-bold text-[#E8A020] hover:border-[#E8A020]/50"
            @click="notifications.markAllAsRead"
          >
            <CheckCheck :size="14" />
            <span>{{ locale.isArabic ? 'تحديد الكل كمقروء' : 'Mark all read' }}</span>
          </button>
          <button
            v-if="notifications.list.length > 0"
            type="button"
            class="inline-flex items-center gap-1 rounded-xl border border-red-500/20 bg-red-500/5 px-3 py-1.5 text-xs font-bold text-red-400 hover:bg-red-500/15"
            @click="notifications.clearAll"
          >
            <Trash2 :size="14" />
            <span>{{ locale.isArabic ? 'مسح الكل' : 'Clear all' }}</span>
          </button>
        </div>
      </div>

      <div
        v-if="notifications.list.length === 0"
        class="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-8 sm:p-12 text-center text-xs text-[var(--muted)]"
      >
        {{
          locale.isArabic
            ? 'صندوق الإشعارات فارغ حالياً.'
            : 'Your notification box is currently empty.'
        }}
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="item in notifications.list"
          :key="item.id"
          class="flex items-start justify-between gap-3 p-3.5 sm:p-4 rounded-2xl border border-[var(--line)] bg-[var(--panel)] transition"
          :class="{ 'border-[#E8A020]/40 bg-[#E8A020]/[0.03]': !item.isRead }"
        >
          <div class="flex items-start gap-3 min-w-0 flex-1">
            <span
              class="mt-1 grid h-8 w-8 sm:h-9 sm:w-9 shrink-0 place-items-center rounded-xl"
              :class="
                item.isRead
                  ? 'bg-[var(--glass)] text-[var(--muted)]'
                  : 'bg-[#E8A020]/15 text-[#E8A020]'
              "
            >
              <Bell :size="16" />
            </span>
            <div class="min-w-0 flex-1 text-start">
              <h3 class="text-xs sm:text-sm font-bold text-[var(--text)] line-clamp-1">
                {{ item.title }}
              </h3>
              <p class="mt-1 text-xs text-[var(--muted)] leading-relaxed">{{ item.message }}</p>
              <span class="mt-1.5 inline-block text-[10px] text-[var(--muted)]">{{
                item.timestamp
              }}</span>
            </div>
          </div>

          <div class="flex items-center gap-2 shrink-0">
            <button
              v-if="!item.isRead"
              type="button"
              class="text-xs font-bold text-[#E8A020] hover:underline"
              @click="notifications.markAsRead(item.id)"
            >
              {{ locale.isArabic ? 'تعليم كمقروء' : 'Mark read' }}
            </button>
            <button
              type="button"
              :aria-label="locale.isArabic ? 'حذف' : 'Delete'"
              class="rounded-lg p-1 text-[var(--muted)] hover:text-red-400"
              @click="notifications.remove(item.id)"
            >
              <Trash2 :size="14" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 5: ADDRESSES -->
    <div v-else-if="activeTab === 'addresses'" class="mt-6 sm:mt-8 space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 class="text-base sm:text-lg font-bold text-[var(--text)]">
            {{ locale.isArabic ? 'عناوين التوصيل المسجلة' : 'Saved Delivery Addresses' }}
          </h2>
          <p class="text-xs text-[var(--muted)]">
            {{
              locale.isArabic
                ? 'تُستخدم لتحديد رسوم التوصيل وتسليم الطلبات باليد'
                : 'Used for calculating shipping fees and courier handoff'
            }}
          </p>
        </div>
        <button
          type="button"
          class="inline-flex self-start sm:self-auto items-center gap-1.5 rounded-xl bg-[#E8A020] px-4 py-2 text-xs font-bold text-[#071F0D]"
          @click="
            toast.info(
              locale.isArabic ? 'سيتم فتح نافذة إضافة عنوان جديد' : 'New address modal will open',
            )
          "
        >
          <Plus :size="14" />
          <span>{{ locale.isArabic ? 'إضافة عنوان' : 'Add Address' }}</span>
        </button>
      </div>

      <div class="grid gap-3.5 sm:gap-4 sm:grid-cols-2">
        <div
          v-for="addr in savedAddresses"
          :key="addr.id"
          class="flex flex-col justify-between rounded-2xl border p-4 sm:p-5 transition"
          :class="
            addr.isDefault
              ? 'border-[#E8A020]/60 bg-[#E8A020]/[0.04]'
              : 'border-[var(--line)] bg-[var(--panel)]'
          "
        >
          <div>
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-bold text-[var(--text)]">{{ addr.title }}</h3>
              <span
                v-if="addr.isDefault"
                class="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-400"
              >
                {{ locale.isArabic ? 'الافتراضي' : 'Default' }}
              </span>
            </div>
            <p class="mt-2 text-xs leading-relaxed text-[var(--muted)]">{{ addr.details }}</p>
          </div>

          <div
            class="mt-4 flex items-center justify-between border-t border-[var(--line)] pt-3 text-xs"
          >
            <button
              v-if="!addr.isDefault"
              type="button"
              class="font-semibold text-[#E8A020] hover:underline"
              @click="setDefaultAddress(addr.id)"
            >
              {{ locale.isArabic ? 'تعيين كافتراضي' : 'Set as default' }}
            </button>
            <span v-else class="text-[11px] text-[var(--muted)]">
              {{ locale.isArabic ? 'العنوان المعتمد للطلبات' : 'Primary delivery address' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 6: SETTINGS -->
    <div v-else-if="activeTab === 'settings'" class="mt-6 sm:mt-8 max-w-xl space-y-6">
      <div class="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-4 sm:p-6">
        <h2 class="text-base font-bold text-[var(--text)]">
          {{ locale.isArabic ? 'تعديل البيانات الشخصية' : 'Edit Personal Information' }}
        </h2>
        <form class="mt-5 space-y-4" @submit.prevent="handleSaveProfile">
          <div>
            <label class="mb-1 block text-xs font-bold text-[var(--soft)] text-start">
              {{ locale.isArabic ? 'الاسم الكامل' : 'Full Name' }}
            </label>
            <input
              v-model="formName"
              type="text"
              class="h-11 w-full rounded-xl border border-[var(--line)] bg-[var(--input)] px-3 text-sm text-[var(--text)] outline-none focus:border-[#E8A020] text-start"
            />
          </div>

          <div>
            <label class="mb-1 block text-xs font-bold text-[var(--soft)] text-start">
              {{ locale.isArabic ? 'البريد الإلكتروني' : 'Email Address' }}
            </label>
            <input
              v-model="formEmail"
              type="email"
              dir="ltr"
              class="h-11 w-full rounded-xl border border-[var(--line)] bg-[var(--input)] px-3 text-sm text-[var(--text)] outline-none focus:border-[#E8A020] text-start"
            />
          </div>

          <div>
            <label class="mb-1 block text-xs font-bold text-[var(--soft)] text-start">
              {{ locale.isArabic ? 'رقم الهاتف' : 'Phone Number' }}
            </label>
            <input
              v-model="formPhone"
              type="tel"
              dir="ltr"
              class="h-11 w-full rounded-xl border border-[var(--line)] bg-[var(--input)] px-3 text-sm text-[var(--text)] outline-none focus:border-[#E8A020] text-start"
            />
          </div>

          <div>
            <label class="mb-1 block text-xs font-bold text-[var(--soft)] text-start">
              {{ locale.isArabic ? 'المحافظة / المدينة' : 'City / Governorate' }}
            </label>
            <input
              v-model="formCity"
              type="text"
              class="h-11 w-full rounded-xl border border-[var(--line)] bg-[var(--input)] px-3 text-sm text-[var(--text)] outline-none focus:border-[#E8A020] text-start"
            />
          </div>

          <button
            type="submit"
            class="inline-flex items-center gap-2 rounded-xl bg-[#E8A020] px-6 py-2.5 text-xs font-bold text-[#071F0D] hover:bg-[#F5C060] transition"
          >
            <Save :size="15" />
            <span>{{ locale.isArabic ? 'حفظ التعديلات' : 'Save Changes' }}</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

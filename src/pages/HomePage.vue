<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  ArrowLeft,
  BadgeCheck,
  Banknote,
  Droplets,
  Handshake,
  MapPinned,
  Rocket,
  Search,
  ShieldCheck,
  ShoppingCart,
  Star,
  Store,
  Truck,
} from 'lucide-vue-next'
import { RouterLink, useRouter } from 'vue-router'
import ProductCard from '@/components/product/ProductCard.vue'
import { categories } from '@/data/categories'
import { featuredMerchants, merchants } from '@/data/merchants'
import { products } from '@/data/products'
import type { ProductCategory } from '@/types/product'
import { UiButton } from '@/components/ui'

const router = useRouter()
const search = ref('')
const selectedCategory = ref<ProductCategory | 'All'>('All')

const heroStats = [
  { value: `${merchants.length}+`, label: 'متجر موثوق' },
  { value: `${products.length}+`, label: 'منتج متاح' },
  { value: '14', label: 'محافظة' },
]

const featuredProducts = computed(() =>
  selectedCategory.value === 'All'
    ? [...products]
        .sort((a, b) => Number(Boolean(b.isBestseller)) - Number(Boolean(a.isBestseller)))
        .slice(0, 4)
    : products.filter((product) => product.category === selectedCategory.value).slice(0, 4),
)

const reasons = [
  {
    icon: BadgeCheck,
    title: 'تجار موثوقون',
    copy: 'كل المتاجر مُراجَعة ومعتمدة من فريقنا',
  },
  {
    icon: Banknote,
    title: 'أسعار شفافة',
    copy: 'أسعار التجزئة والجملة بدون أي خفايا',
  },
  {
    icon: Truck,
    title: 'توصيل لكل سوريا',
    copy: 'نوصل لجميع المحافظات السورية',
  },
  {
    icon: ShieldCheck,
    title: 'دفع عند الاستلام',
    copy: 'ادفع بعد ما تشوف البضاعة بعينك',
  },
]

function searchProducts() {
  if (search.value.trim()) router.push({ path: '/search', query: { q: search.value.trim() } })
}
</script>

<template>
  <div>
    <!-- Hero -->
    <section
      class="relative mt-5 overflow-hidden rounded-[20px] border border-[#E8A020]/25 bg-gradient-to-bl from-[#0F3D20] via-[#0B2A14] to-[#071F0D] px-5 py-12 sm:px-10 sm:py-16 lg:px-14 lg:py-20"
    >
      <div
        class="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#E8A020]/[0.10] blur-[110px]"
      ></div>
      <div
        class="absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-[#0F3D20]/60 blur-[110px]"
      ></div>

      <div class="relative z-10">
        <p
          class="inline-flex items-center gap-2 rounded-full border border-[#E8A020]/30 bg-[#E8A020]/10 px-4 py-1.5 text-[12px] font-bold text-[#E8A020]"
        >
          <Droplets :size="13" />
          المنصة الأولى لزيوت السيارات في سوريا
        </p>

        <h1
          class="display-font mt-6 max-w-3xl text-[clamp(2.2rem,7vw,4.4rem)] font-extrabold leading-[1.15] text-[var(--text)]"
        >
          تسوق من <span class="text-[#E8A020]">أفضل متاجر</span> الزيوت وقطع الغيار
        </h1>

        <p class="mt-5 max-w-xl text-sm leading-loose text-white/80 sm:text-base">
          منصة تجمع أفضل تجار الزيوت والمصافي وقطع الغيار — أسعار شفافة، توصيل موثوق، جودة مضمونة
        </p>

        <div class="mt-8 flex flex-wrap gap-3">
          <RouterLink
            to="/products"
            class="inline-flex h-12 items-center gap-2 rounded-xl bg-gradient-to-l from-[#E8A020] to-[#c47a10] px-7 text-sm font-bold text-[var(--text)] shadow-[0_8px_28px_rgba(232,160,32,0.35)] transition hover:-translate-y-0.5"
            ><ShoppingCart :size="16" /> تسوق الآن</RouterLink
          ><RouterLink
            to="/merchants"
            class="inline-flex h-12 items-center gap-2 rounded-xl border border-[var(--line-strong)] bg-[var(--glass-strong)] px-7 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--glass-strong)] hover:-translate-y-0.5"
            ><Store :size="16" /> تصفح المتاجر</RouterLink
          >
        </div>

        <div class="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-[var(--line)] pt-6">
          <div v-for="stat in heroStats" :key="stat.label">
            <p class="display-font text-2xl font-extrabold text-[#E8A020] sm:text-3xl">
              {{ stat.value }}
            </p>
            <p class="mt-1 text-[12px] text-white/65">{{ stat.label }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Search -->
    <section class="grid gap-5 py-12 sm:py-14 lg:grid-cols-[1fr_1.1fr] lg:items-center">
      <div>
        <div
          class="mb-5 inline-flex items-center gap-2 rounded-full border border-[#E8A020]/25 bg-[#E8A020]/[0.08] px-3 py-1.5 text-[12px] font-bold uppercase text-[#E8A020]"
        >
          <Store :size="13" /> منصة سورية لزيوت السيارات
        </div>
        <h2 class="display-font text-3xl font-bold leading-tight text-[var(--text)] sm:text-4xl">
          زيتك الصح،<br /><span class="text-[#E8A020]">هون لقيته</span>
        </h2>
        <p class="mt-4 max-w-md text-sm leading-relaxed text-[var(--muted)]">
          زيوت محركات، مصافي، وزيوت ناقل حركة من تجار موثوقين في كل سوريا — بأسعار واضحة وبدون
          مفاجآت.
        </p>
      </div>
      <form
        class="flex items-center rounded-xl border border-[var(--line)] bg-[var(--panel)] p-1.5 focus-within:border-[#E8A020]/60"
        @submit.prevent="searchProducts"
      >
        <Search :size="17" class="mr-3 shrink-0 text-[var(--muted)]" /><label
          class="sr-only"
          for="home-search"
          >ابحث عن زيت أو مصفاة أو علامة</label
        ><input
          id="home-search"
          v-model="search"
          type="search"
          placeholder="ابحث عن زيت أو مصفاة أو علامة…"
          class="h-11 min-w-0 flex-1 bg-transparent px-3 text-sm text-[var(--text)] outline-none placeholder:text-[var(--muted)]"
        /><UiButton
          type="submit"
          size="sm"
          class="rounded-lg bg-[#E8A020] text-[12px] text-[#071F0D] hover:bg-[#F5C060]"
          >بحث</UiButton
        >
      </form>
    </section>

    <!-- Categories -->
    <section class="border-y border-[var(--line)] py-7">
      <div class="flex items-center justify-between gap-4">
        <p class="shrink-0 text-[12px] font-bold uppercase text-[var(--muted)]">تسوق حسب الفئة</p>
        <div class="hidden h-px flex-1 bg-white/[0.07] sm:block"></div>
        <RouterLink to="/products" class="shrink-0 text-[12px] font-semibold text-[#E8A020]"
          >عرض الكل ←</RouterLink
        >
      </div>
      <div class="no-scrollbar mt-5 flex gap-3 overflow-x-auto pb-1">
        <button
          v-for="category in categories"
          :key="category.value"
          class="flex shrink-0 items-center gap-3 rounded-xl border px-4 py-3 text-left transition"
          :class="
            selectedCategory === category.value
              ? 'border-[#E8A020]/50 bg-[#E8A020]/10 text-white'
              : 'border-[var(--line)] bg-[var(--panel)] text-[var(--soft)] hover:border-[var(--line-strong)]'
          "
          :aria-pressed="selectedCategory === category.value"
          @click="selectedCategory = category.value"
        >
          <span
            class="grid h-8 w-8 place-items-center rounded-lg bg-[var(--glass)] text-sm text-[#E8A020]"
            ><component :is="category.icon" :size="15" /></span
          ><span class="whitespace-nowrap text-xs font-semibold">{{ category.label }}</span>
        </button>
      </div>
    </section>

    <!-- Featured products -->
    <section class="py-12 sm:py-14">
      <div class="mb-8 flex items-start justify-between gap-4 sm:mb-10">
        <div>
          <p class="mb-2 text-[12px] font-bold uppercase text-[#E8A020]">أبرز المنتجات</p>
          <h2
            class="display-font text-[25px] font-bold leading-tight text-[var(--text)] sm:text-3xl"
          >
            الأكثر طلباً
          </h2>
        </div>
        <RouterLink
          to="/products"
          class="group hidden items-center gap-2 border-b border-[#E8A020]/50 pb-1 text-[12px] font-medium uppercase text-[var(--muted)] transition hover:text-[var(--text)] sm:flex"
          >كل المنتجات
          <ArrowLeft :size="12" class="text-[#E8A020] transition group-hover:-translate-x-0.5"
        /></RouterLink>
      </div>
      <div class="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        <ProductCard v-for="product in featuredProducts" :key="product.id" :product="product" />
      </div>
      <RouterLink
        to="/products"
        class="mt-5 flex items-center justify-center gap-2 rounded-xl border border-[var(--line)] py-3 text-xs font-semibold text-[var(--soft)] sm:hidden"
        >عرض كل المنتجات <ArrowLeft :size="14"
      /></RouterLink>
    </section>

    <!-- Featured merchants -->
    <section class="border-y border-[var(--line)] py-12 sm:py-14">
      <div class="mb-8 flex items-end justify-between gap-4">
        <div>
          <p class="mb-2 text-[12px] font-bold uppercase text-[#E8A020]">متاجر موثوقة</p>
          <h2
            class="display-font text-[25px] font-bold leading-tight text-[var(--text)] sm:text-3xl"
          >
            أبرز المتاجر
          </h2>
        </div>
        <RouterLink
          to="/merchants"
          class="shrink-0 text-[12px] font-semibold text-[#E8A020] transition hover:text-[var(--text)]"
          >كل المتاجر ←</RouterLink
        >
      </div>
      <div class="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        <RouterLink
          v-for="merchant in featuredMerchants"
          :key="merchant.id"
          :to="`/merchants/${merchant.id}`"
          class="group flex flex-col items-center gap-2 rounded-[20px] border border-[var(--line)] bg-[var(--panel)] p-5 text-center transition hover:-translate-y-1 hover:border-[#E8A020]/40"
        >
          <span
            class="grid h-16 w-16 place-items-center overflow-hidden rounded-full border-2 border-[var(--line)] bg-[var(--elevated)] text-2xl font-bold text-[#E8A020]"
          >
            <img
              v-if="merchant.image"
              :src="merchant.image"
              :alt="merchant.name"
              class="h-full w-full object-cover"
            />
            <Store v-if="!merchant.image" :size="26" />
          </span>
          <h3 class="text-xs font-bold text-[var(--text)] transition group-hover:text-[#E8A020]">
            {{ merchant.name }}
          </h3>
          <p v-if="merchant.reviewCount" class="flex items-center gap-1 text-[12px] text-[#E8A020]">
            <Star :size="12" fill="currentColor" stroke="none" />{{ merchant.rating.toFixed(1) }}
            <span class="text-[var(--muted)]">({{ merchant.reviewCount }})</span>
          </p>
          <p v-else class="text-[12px] text-[var(--muted)]">لا توجد تقييمات بعد</p>
        </RouterLink>
      </div>
    </section>

    <!-- Why ZaytStore -->
    <section class="py-12 sm:py-14">
      <div class="mb-8 text-center">
        <p class="mb-2 text-[12px] font-bold uppercase text-[#E8A020]">لماذا ZaytStore؟</p>
        <h2 class="display-font text-3xl font-bold text-[var(--text)] sm:text-4xl">
          أربع أسباب تخلينا الخيار الأول
        </h2>
      </div>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div
          v-for="reason in reasons"
          :key="reason.title"
          class="rounded-[22px] border border-[var(--line)] bg-[var(--panel)] p-6 transition hover:border-[#E8A020]/40"
        >
          <span class="grid h-11 w-11 place-items-center rounded-xl bg-[#E8A020]/10 text-[#E8A020]">
            <component :is="reason.icon" :size="20" />
          </span>
          <h3 class="mt-4 text-sm font-bold text-[var(--text)]">{{ reason.title }}</h3>
          <p class="mt-2 text-xs leading-relaxed text-[var(--muted)]">{{ reason.copy }}</p>
        </div>
      </div>
    </section>

    <!-- Merchant CTA -->
    <section
      class="mb-4 rounded-[26px] border border-[#E8A020]/25 bg-gradient-to-bl from-[#0F3D20] to-[#071F0D] px-6 py-10 text-center sm:px-12 sm:py-14"
    >
      <span
        class="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-[#E8A020]/30 bg-[#E8A020]/10 text-[#E8A020]"
      >
        <Handshake :size="26" />
      </span>
      <h2 class="display-font mt-4 text-2xl font-bold text-[var(--text)] sm:text-3xl">
        هل أنت تاجر؟ انضم إلينا
      </h2>
      <p class="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-white/65">
        افتح متجرك وابدأ البيع لآلاف الزبائن في كل سوريا
      </p>
      <div class="mt-7 flex flex-wrap justify-center gap-3">
        <RouterLink
          to="/register"
          class="inline-flex h-12 items-center gap-2 rounded-xl bg-gradient-to-l from-[#E8A020] to-[#c47a10] px-7 text-sm font-bold text-[var(--text)] transition hover:-translate-y-0.5"
          ><Rocket :size="16" /> افتح متجرك مجاناً</RouterLink
        ><RouterLink
          to="/merchants"
          class="inline-flex h-12 items-center rounded-xl border border-[var(--line-strong)] bg-[var(--glass-strong)] px-7 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--glass-strong)]"
          >تعرف على المتاجر</RouterLink
        >
      </div>
      <p class="mt-7 flex items-center justify-center gap-2 text-[12px] text-white/45">
        <MapPinned :size="13" class="text-[#E8A020]" /> نغطي 14 محافظة سورية
      </p>
    </section>
  </div>
</template>

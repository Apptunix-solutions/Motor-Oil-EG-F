<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  ArrowLeft,
  BadgeCheck,
  Banknote,
  ChevronLeft,
  ChevronRight,
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
  X,
} from 'lucide-vue-next'
import { RouterLink, useRouter } from 'vue-router'
import ProductCard from '@/components/product/ProductCard.vue'
import { categories } from '@/data/categories'
import { featuredMerchants, merchants } from '@/data/merchants'
import { products } from '@/data/products'
import type { ProductCategory } from '@/types/product'

const router = useRouter()
const search = ref('')
const selectedCategory = ref<ProductCategory | 'All'>('All')

const categoriesTrackRef = ref<HTMLElement | null>(null)
const categoryButtonRefs = new Map<string, HTMLElement>()

function setCategoryRef(val: string, el: unknown) {
  if (el) categoryButtonRefs.set(val, el as HTMLElement)
}

function selectCategory(categoryValue: ProductCategory | 'All', event?: MouseEvent) {
  selectedCategory.value = categoryValue
  const target = (event?.currentTarget as HTMLElement) || categoryButtonRefs.get(categoryValue)
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }
}

function scrollCategories(direction: 'prev' | 'next') {
  if (!categoriesTrackRef.value) return
  const isRtl = document.dir === 'rtl' || document.documentElement.dir === 'rtl'
  const delta = direction === 'next' ? (isRtl ? -220 : 220) : isRtl ? 220 : -220
  categoriesTrackRef.value.scrollBy({ left: delta, behavior: 'smooth' })
}

function onCategoryWheel(e: WheelEvent) {
  if (!categoriesTrackRef.value) return
  if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
    categoriesTrackRef.value.scrollLeft += e.deltaY
  }
}

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
      class="group relative mt-5 overflow-hidden rounded-[24px] border border-[#E8A020]/30 bg-[#071F0D] px-5 py-12 sm:px-10 sm:py-16 lg:px-14 lg:py-20 shadow-[0_12px_40px_rgba(7,31,13,0.5)]"
    >
      <!-- Hero Background Image with Cinematic Depth & Ambient Overlays -->
      <div class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <img
          src="/images/hero-oil-bg.jpg"
          alt=""
          fetchpriority="high"
          loading="eager"
          decoding="async"
          class="h-full w-full object-cover object-center opacity-40 sm:opacity-50 transition-transform duration-1000 ease-out group-hover:scale-105"
        />
        <!-- Directional base gradient overlay -->
        <div
          class="absolute inset-0 bg-gradient-to-t from-[#071F0D] via-[#0B2A14]/80 to-[#0F3D20]/60 mix-blend-multiply"
        ></div>
        <!-- Directional gradient to guarantee crystal-clear text readability in RTL & LTR -->
        <div
          class="absolute inset-0 bg-gradient-to-r from-transparent via-[#071F0D]/75 to-[#071F0D]/95 rtl:bg-gradient-to-l rtl:from-transparent rtl:via-[#071F0D]/75 rtl:to-[#071F0D]/95"
        ></div>
        <!-- Ambient radial glow spots -->
        <div
          class="absolute -end-24 -top-24 h-80 w-80 rounded-full bg-[#E8A020]/[0.18] blur-[110px]"
        ></div>
        <div
          class="absolute -start-20 -bottom-28 h-80 w-80 rounded-full bg-[#0F3D20]/70 blur-[110px]"
        ></div>
      </div>

      <div class="relative z-10">
        <p
          class="inline-flex items-center gap-2 rounded-full border border-[#E8A020]/30 bg-[#E8A020]/15 px-4 py-1.5 text-[12px] font-bold text-[#E8A020] shadow-sm backdrop-blur-md"
        >
          <Droplets :size="13" />
          المنصة الأولى لزيوت السيارات في سوريا
        </p>

        <h1
          class="display-font mt-6 max-w-3xl text-[clamp(2.2rem,7vw,4.4rem)] font-extrabold leading-[1.15] text-white"
        >
          تسوق من <span class="text-[#E8A020]">أفضل متاجر</span> الزيوت وقطع الغيار
        </h1>

        <p class="mt-5 max-w-xl text-sm leading-loose text-white/85 sm:text-base">
          منصة تجمع أفضل تجار الزيوت والمصافي وقطع الغيار — أسعار شفافة، توصيل موثوق، جودة مضمونة
        </p>

        <div class="mt-8 flex flex-wrap gap-3">
          <RouterLink
            to="/products"
            class="inline-flex h-12 items-center gap-2 rounded-xl bg-gradient-to-l from-[#E8A020] to-[#f5ab2d] px-7 text-sm font-bold text-[#071F0D] shadow-[0_8px_28px_rgba(232,160,32,0.4)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_32px_rgba(232,160,32,0.5)] active:translate-y-0 active:scale-[0.98]"
            ><ShoppingCart :size="16" /> تسوق الآن</RouterLink
          ><RouterLink
            to="/merchants"
            class="inline-flex h-12 items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-7 text-sm font-semibold text-white backdrop-blur-md transition-all duration-200 hover:border-[#E8A020]/50 hover:bg-white/15 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
            ><Store :size="16" /> تصفح المتاجر</RouterLink
          >
        </div>

        <div class="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-white/15 pt-6">
          <div v-for="stat in heroStats" :key="stat.label">
            <p class="display-font text-2xl font-extrabold text-[#E8A020] sm:text-3xl">
              {{ stat.value }}
            </p>
            <p class="mt-1 text-[12px] text-white/70">{{ stat.label }}</p>
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
        class="group relative flex items-center gap-2 rounded-2xl border border-[var(--line)] bg-[var(--panel)]/95 p-1.5 sm:p-2 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-[var(--line-strong)] hover:shadow-md focus-within:border-[#E8A020] focus-within:ring-4 focus-within:ring-[#E8A020]/15 focus-within:shadow-[0_8px_30px_rgba(232,160,32,0.12)]"
        @submit.prevent="searchProducts"
      >
        <!-- Search Leading Icon with logical padding -->
        <div
          class="pointer-events-none flex shrink-0 items-center justify-center ps-2.5 sm:ps-3 text-[var(--muted)] transition-colors duration-200 group-focus-within:text-[#E8A020]"
          aria-hidden="true"
        >
          <Search :size="19" class="stroke-[2.2]" />
        </div>

        <label class="sr-only" for="home-search"> ابحث عن زيت أو مصفاة أو علامة </label>

        <!-- Input Field -->
        <input
          id="home-search"
          v-model="search"
          type="search"
          placeholder="ابحث عن زيت أو مصفاة أو علامة…"
          class="h-11 min-w-0 flex-1 bg-transparent px-2.5 text-sm sm:text-base font-medium text-[var(--text)] outline-none placeholder:text-[var(--muted)] placeholder:text-sm"
        />

        <!-- Clear Search Action -->
        <button
          v-if="search"
          type="button"
          aria-label="مسح البحث"
          class="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-[var(--muted)] transition-colors hover:bg-[var(--glass)] hover:text-[var(--text)]"
          @click="search = ''"
        >
          <X :size="16" />
        </button>

        <!-- Modern Expert Search Button -->
        <button
          type="submit"
          class="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-[#E8A020] to-[#f5ab2d] px-5 sm:px-6 text-sm font-bold text-[#071F0D] shadow-[0_4px_14px_rgba(232,160,32,0.30)] transition-all duration-200 hover:-translate-y-0.5 hover:from-[#f5ab2d] hover:to-[#ffb738] hover:shadow-[0_6px_22px_rgba(232,160,32,0.45)] active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8A020] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--panel)]"
        >
          <Search :size="15" class="shrink-0 stroke-[2.5]" />
          <span>بحث</span>
        </button>
      </form>
    </section>

    <!-- Categories -->
    <section class="border-y border-[var(--line)] py-6 sm:py-7">
      <div class="flex items-center justify-between gap-3">
        <div class="flex items-center gap-2">
          <p
            class="shrink-0 text-xs sm:text-sm font-bold uppercase tracking-wider text-[var(--muted)]"
          >
            تسوق حسب الفئة
          </p>
          <span
            class="rounded-full bg-[#E8A020]/15 px-2 py-0.5 text-[11px] font-bold text-[#E8A020]"
          >
            {{ categories.length }} فئات
          </span>
        </div>
        <div class="hidden h-px flex-1 bg-[var(--line)] sm:block"></div>
        <div class="flex items-center gap-2">
          <!-- Direct Mobile/Desktop Scroll Controls -->
          <div class="flex items-center gap-1">
            <button
              type="button"
              aria-label="الفئات السابقة"
              title="الفئات السابقة"
              class="grid h-7 w-7 place-items-center rounded-lg border border-[var(--line)] bg-[var(--panel)] text-[var(--text)] hover:border-[#E8A020]/50 hover:bg-[#E8A020]/15 hover:text-[#E8A020] transition active:scale-90"
              @click="scrollCategories('prev')"
            >
              <ChevronRight :size="15" stroke-width="2.5" />
            </button>
            <button
              type="button"
              aria-label="الفئات التالية"
              title="الفئات التالية"
              class="grid h-7 w-7 place-items-center rounded-lg border border-[var(--line)] bg-[var(--panel)] text-[var(--text)] hover:border-[#E8A020]/50 hover:bg-[#E8A020]/15 hover:text-[#E8A020] transition active:scale-90"
              @click="scrollCategories('next')"
            >
              <ChevronLeft :size="15" stroke-width="2.5" />
            </button>
          </div>
          <RouterLink
            to="/products"
            class="shrink-0 inline-flex items-center gap-1 text-xs font-bold text-[#E8A020] transition hover:underline ps-1"
          >
            <span>عرض الكل</span>
            <span aria-hidden="true">←</span>
          </RouterLink>
        </div>
      </div>

      <!-- Scrollable Category Track with Edge Bleed & High-Contrast Touch Pills -->
      <div class="relative mt-4 -mx-4 px-4 sm:mx-0 sm:px-0">
        <div
          ref="categoriesTrackRef"
          class="no-scrollbar flex gap-2.5 sm:gap-3 overflow-x-auto pb-2 pt-1 scroll-smooth snap-x snap-mandatory focus:outline-none"
          role="tablist"
          aria-label="تسوق حسب الفئة"
          @wheel.passive="onCategoryWheel"
        >
          <button
            v-for="category in categories"
            :key="category.value"
            :ref="(el) => setCategoryRef(category.value, el)"
            role="tab"
            :aria-selected="selectedCategory === category.value"
            type="button"
            class="group flex shrink-0 items-center gap-2.5 sm:gap-3 rounded-2xl border px-3.5 sm:px-4 py-2.5 sm:py-3 transition-all duration-200 snap-start select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E8A020]"
            :class="
              selectedCategory === category.value
                ? 'border-[#E8A020] bg-gradient-to-l from-[#E8A020] to-[#f5ab2d] text-[#071F0D] font-black shadow-[0_4px_16px_rgba(232,160,32,0.30)] scale-[1.02]'
                : 'border-[var(--line)] bg-[var(--panel)] text-[var(--text)] hover:border-[#E8A020]/40 hover:bg-[var(--elevated)]'
            "
            @click="selectCategory(category.value, $event)"
          >
            <span
              class="grid h-8 w-8 place-items-center rounded-xl text-sm transition-colors duration-200"
              :class="
                selectedCategory === category.value
                  ? 'bg-[#071F0D]/15 text-[#071F0D]'
                  : 'bg-[var(--glass)] text-[#E8A020] group-hover:bg-[#E8A020]/15'
              "
            >
              <component :is="category.icon" :size="16" stroke-width="2.3" />
            </span>
            <span class="whitespace-nowrap text-xs sm:text-sm font-bold">
              {{ category.label }}
            </span>
          </button>
        </div>
      </div>
    </section>

    <!-- Featured products -->
    <section class="py-12 sm:py-14">
      <div class="mb-8 flex items-start justify-between gap-4">
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

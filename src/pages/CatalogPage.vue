<script setup lang="ts">
import { formatPrice } from '@/lib/utils'
import { computed, ref, watch } from 'vue'
import {
  ArrowDownUp,
  Filter,
  LayoutGrid,
  List,
  Search,
  SlidersHorizontal,
  Star,
  X,
} from 'lucide-vue-next'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import ProductCard from '@/components/product/ProductCard.vue'
import { UiSelect } from '@/components/ui'
import { categories } from '@/data/categories'
import { products } from '@/data/products'
import type { ProductCategory } from '@/types/product'

const route = useRoute()
const router = useRouter()

/**
 * يحوّل قيمة وصلة الفئة إلى القيمة الداخلية بغضّ النظر عن صيغتها:
 * م.slug الإنجليزي (engine-oils)، أو الملصق العربي (زيوت المحركات)، أو القيمة
 * الداخلية (Engine Oil). هكذا تعمل روابط URL العربية والإنجليزية معاً.
 */
function resolveCategory(raw: unknown): ProductCategory | 'All' {
  if (raw == null) return 'All'
  const key = String(raw).trim()
  if (!key) return 'All'
  const bySlug = categories.find((entry) => entry.slug === key)
  if (bySlug) return bySlug.value
  const byLabel = categories.find((entry) => entry.label === key)
  if (byLabel) return byLabel.value
  const byValue = categories.find(
    (entry) => String(entry.value).toLowerCase() === key.toLowerCase(),
  )
  return byValue ? byValue.value : 'All'
}

/** الحالة الأولى مأخوذة من رابط URL حتى تفتح المشاركة بنفس الفلاتر. */
const query = ref(String(route.query.q ?? ''))
const selectedCategory = ref<ProductCategory | 'All'>(resolveCategory(route.query.category))
const selectedViscosity = ref(String(route.query.viscosity ?? 'All'))
const selectedBase = ref(String(route.query.base ?? 'All'))
const selectedBrands = ref<string[]>(
  route.query.brand ? String(route.query.brand).split(',').filter(Boolean) : [],
)
const onlyAvailable = ref(route.query.available === '1')
const sortBy = ref<'featured' | 'price-low' | 'price-high' | 'rating'>(
  ['rating', 'price-low', 'price-high'].includes(String(route.query.sort))
    ? (String(route.query.sort) as 'rating' | 'price-low' | 'price-high')
    : 'featured',
)
// Auto-open filters when arriving via a deep-link
const showFilters = ref(
  !!(route.query.filter || route.query.base || route.query.category || route.query.brand),
)
const view = ref<'grid' | 'list'>('grid')

const viscosities = [
  'All',
  '0W-20',
  '0W-30',
  '5W-20',
  '5W-30',
  '5W-40',
  '10W-40',
  '15W-40',
  '20W-50',
]
const bases = ['All', 'كامل التخليق', 'شبه تخليقي', 'معدني']
const brands = [...new Set(products.map((product) => product.brand))]
const sortOptions = [
  { label: 'الترتيب: المميز', value: 'featured' },
  { label: 'الأعلى تقييماً', value: 'rating' },
  { label: 'السعر: من الأقل', value: 'price-low' },
  { label: 'السعر: من الأعلى', value: 'price-high' },
]

const activeCategorySlug = computed(
  () => categories.find((entry) => entry.value === selectedCategory.value)?.slug ?? 'all',
)
const activeFilterCount = computed(
  () =>
    selectedBrands.value.length +
    (selectedViscosity.value !== 'All' ? 1 : 0) +
    (selectedBase.value !== 'All' ? 1 : 0) +
    (selectedCategory.value !== 'All' ? 1 : 0) +
    (onlyAvailable.value ? 1 : 0),
)

const filteredProducts = computed(() => {
  const matching = products.filter((product) => {
    const searchable =
      `${product.name} ${product.brand} ${product.viscosity} ${product.base} ${product.merchantName} ${product.tags.join(' ')}`.toLowerCase()
    const matchesQuery = searchable.includes(query.value.toLowerCase())
    const matchesCategory =
      selectedCategory.value === 'All' || product.category === selectedCategory.value
    const matchesViscosity =
      selectedViscosity.value === 'All' ||
      product.viscosity.toUpperCase() === selectedViscosity.value
    const matchesBase = selectedBase.value === 'All' || product.base === selectedBase.value
    const matchesBrand =
      !selectedBrands.value.length || selectedBrands.value.includes(product.brand)
    const matchesAvailability = !onlyAvailable.value || product.stock > 0
    return (
      matchesQuery &&
      matchesCategory &&
      matchesViscosity &&
      matchesBase &&
      matchesBrand &&
      matchesAvailability
    )
  })
  return [...matching].sort((a, b) => {
    if (sortBy.value === 'price-low') return a.price - b.price
    if (sortBy.value === 'price-high') return b.price - a.price
    if (sortBy.value === 'rating') return b.rating - a.rating
    return Number(Boolean(b.isBestseller)) - Number(Boolean(a.isBestseller))
  })
})

/**
 * عكس الحالة الحالية إلى سلسلة استعلام الرابط حتى تصبح كل فلترة قابلة للمشاركة
 * وتعمل من URL عربي أو إنجليزي. نستخدم replace حتى لا نملأ سجلّ التنقل.
 */
let syncingFromUrl = false
function syncUrl() {
  if (syncingFromUrl) return
  const q: Record<string, string> = {}
  if (query.value.trim()) q.q = query.value.trim()
  if (selectedCategory.value !== 'All') q.category = activeCategorySlug.value
  if (selectedViscosity.value !== 'All') q.viscosity = selectedViscosity.value
  if (selectedBase.value !== 'All') q.base = selectedBase.value
  if (selectedBrands.value.length) q.brand = selectedBrands.value.join(',')
  if (onlyAvailable.value) q.available = '1'
  if (sortBy.value !== 'featured') q.sort = sortBy.value
  void router.replace({ path: '/products', query: q })
}

// أي تغيير في الفلاتر يُعكس مباشرة على الرابط.
watch(
  [query, selectedCategory, selectedViscosity, selectedBase, selectedBrands, onlyAvailable, sortBy],
  () => syncUrl(),
)

// وصلة جديدة خارجياً (رجوع/تقدّم أو لink مشارك) تُحدّث الحالة دون حلقة.
watch(
  () => route.query,
  (next) => {
    syncingFromUrl = true
    query.value = String(next.q ?? '')
    selectedCategory.value = resolveCategory(next.category)
    selectedViscosity.value = String(next.viscosity ?? 'All')
    selectedBase.value = String(next.base ?? 'All')
    selectedBrands.value = next.brand ? String(next.brand).split(',').filter(Boolean) : []
    onlyAvailable.value = next.available === '1'
    sortBy.value = ['rating', 'price-low', 'price-high'].includes(String(next.sort))
      ? (String(next.sort) as 'rating' | 'price-low' | 'price-high')
      : 'featured'
    showFilters.value = !!(
      next.filter ||
      next.base ||
      next.category ||
      next.brand ||
      next.viscosity
    )
    syncingFromUrl = false
  },
)

function toggleBrand(brand: string) {
  selectedBrands.value = selectedBrands.value.includes(brand)
    ? selectedBrands.value.filter((item) => item !== brand)
    : [...selectedBrands.value, brand]
}
function clearFilters() {
  selectedCategory.value = 'All'
  selectedViscosity.value = 'All'
  selectedBase.value = 'All'
  selectedBrands.value = []
  onlyAvailable.value = false
}

function resetSearch() {
  query.value = ''
  clearFilters()
}
</script>

<template>
  <div class="pb-10 pt-10 sm:pt-14">
    <div class="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
      <div>
        <p class="mb-2 text-[12px] font-bold uppercase text-[#E8A020]">المتجر</p>
        <h1 class="display-font text-4xl font-bold text-[var(--text)] sm:text-5xl">
          جميع المنتجات<span class="text-[#E8A020]">.</span>
        </h1>
        <p class="mt-3 max-w-md text-sm text-[var(--muted)]">
          زيوت محركات، مصافي، وزيوت ناقل حركة من تجار موثوقين في سوريا — أسعار واضحة بالدولار.
        </p>
      </div>
      <div class="flex items-center gap-2 text-xs text-[var(--muted)]">
        <span class="grid h-8 w-8 place-items-center rounded-full bg-[#E8A020]/10 text-[#E8A020]"
          ><span class="h-2 w-2 rounded-full bg-[#E8A020]"></span
        ></span>
        متوفر وجاهز للشحن
      </div>
    </div>
    <div
      class="sticky top-[72px] z-30 -mx-5 border-y border-[var(--line)] bg-[var(--bg)]/95 px-5 py-4 backdrop-blur-xl sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0"
    >
      <div class="flex gap-2">
        <label class="relative flex min-w-0 flex-1 items-center"
          ><span class="sr-only">بحث في المنتجات</span
          ><Search :size="17" class="absolute right-4 text-[var(--muted)]" /><input
            v-model="query"
            type="search"
            placeholder="ابحث بالعلامة أو اللزوجة أو المواصفة"
            class="h-12 w-full rounded-xl border border-[var(--line)] bg-[var(--panel)] pr-11 pl-4 text-sm text-[var(--text)] outline-none placeholder:text-[var(--muted)] focus:border-[#E8A020]/60" /></label
        ><button
          class="relative grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-[var(--line)] bg-[var(--panel)] text-[var(--soft)] transition hover:border-[var(--line-strong)] hover:text-[var(--text)] sm:hidden"
          aria-label="فتح الفلاتر"
          :aria-expanded="showFilters"
          @click="showFilters = !showFilters"
        >
          <Filter :size="18" /><span
            v-if="activeFilterCount"
            class="absolute -left-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-[#E8A020] px-1 text-[11px] font-bold text-[#071F0D]"
            >{{ activeFilterCount }}</span
          ></button
        ><button
          class="hidden h-12 items-center gap-2 rounded-xl border border-[var(--line)] bg-[var(--panel)] px-4 text-[12px] font-semibold text-[var(--soft)] transition hover:text-[var(--text)] sm:flex"
          :aria-expanded="showFilters"
          @click="showFilters = !showFilters"
        >
          <SlidersHorizontal :size="16" /> الفلاتر
          <span v-if="activeFilterCount" class="text-[#E8A020]">({{ activeFilterCount }})</span>
        </button>
      </div>
      <div class="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1" aria-label="تصفية حسب الفئة">
        <button
          v-for="category in categories"
          :key="category.slug"
          class="flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-2 text-[12px] font-semibold transition"
          :class="
            selectedCategory === category.value
              ? 'border-[#E8A020]/50 bg-[#E8A020]/10 text-[#E8A020]'
              : 'border-[var(--line)] text-[var(--muted)] hover:border-[var(--line-strong)] hover:text-[var(--text)]'
          "
          :aria-pressed="selectedCategory === category.value"
          @click="selectedCategory = category.value"
        >
          <component :is="category.icon" :size="14" />
          {{ category.label }}
        </button>
      </div>
    </div>
    <div
      v-if="showFilters"
      class="mt-5 rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-5 sm:p-6"
    >
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-sm font-semibold text-[var(--text)]">اضبط بحثك</h2>
          <p class="mt-1 text-[12px] text-[var(--muted)]">صفي حسب اللزوجة والتركيبة والتوفر.</p>
        </div>
        <button
          aria-label="إغلاق الفلاتر"
          class="text-[var(--muted)] hover:text-[var(--text)]"
          @click="showFilters = false"
        >
          <X :size="17" />
        </button>
      </div>
      <div class="mt-6 grid gap-6 sm:grid-cols-3">
        <div>
          <p class="mb-[10px] block text-[12px] font-bold text-[var(--soft)]">العلامة التجارية</p>
          <div class="space-y-2">
            <label
              v-for="brand in brands"
              :key="brand"
              class="flex items-center gap-2 text-xs text-[var(--soft)]"
              ><input
                type="checkbox"
                :checked="selectedBrands.includes(brand)"
                class="h-[15px] w-[15px] accent-[#E8A020]"
                @change="toggleBrand(brand)"
              />{{ brand }}</label
            >
          </div>
        </div>
        <label
          ><span class="mb-[10px] block text-[12px] font-bold text-[var(--soft)]"
            >اللزوجة (SAE)</span
          ><UiSelect v-model="selectedViscosity" :options="viscosities" /></label
        ><label
          ><span class="mb-[10px] block text-[12px] font-bold text-[var(--soft)]">تركيبة الزيت</span
          ><UiSelect v-model="selectedBase" :options="bases"
        /></label>
      </div>
      <div
        class="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--line)] pt-5"
      >
        <label class="flex items-center gap-2 text-xs text-[var(--soft)]"
          ><input
            v-model="onlyAvailable"
            type="checkbox"
            class="h-[15px] w-[15px] accent-[#E8A020]"
          />
          المتوفر حالياً فقط</label
        ><button class="text-xs font-bold text-[#E8A020]" @click="clearFilters">
          مسح كل الفلاتر
        </button>
      </div>
    </div>
    <div class="mb-5 mt-9 flex flex-wrap items-center justify-between gap-3">
      <p class="text-xs text-[var(--muted)]">
        <span class="font-semibold text-[var(--text)]">{{ filteredProducts.length }} منتج</span>
        مطابق لبحثك
      </p>
      <div class="flex items-center gap-2">
        <label class="flex items-center gap-2">
          <span class="sr-only">ترتيب المنتجات</span>
          <UiSelect
            v-model="sortBy"
            :options="sortOptions"
            class="hidden h-8 w-[160px] rounded-lg border border-[var(--line)] bg-[var(--panel)] px-2 text-[12px] font-semibold text-[var(--soft)] outline-none transition focus:border-[#E8A020] focus:ring-1 focus:ring-[#E8A020]/50 sm:flex"
          />
        </label>
        <button
          aria-label="عرض شبكي"
          :aria-pressed="view === 'grid'"
          class="grid h-8 w-8 place-items-center rounded-lg"
          :class="
            view === 'grid' ? 'bg-[var(--glass-strong)] text-[var(--text)]' : 'text-[var(--muted)]'
          "
          @click="view = 'grid'"
        >
          <LayoutGrid :size="16" /></button
        ><button
          aria-label="عرض قائمة"
          :aria-pressed="view === 'list'"
          class="grid h-8 w-8 place-items-center rounded-lg"
          :class="
            view === 'list' ? 'bg-[var(--glass-strong)] text-[var(--text)]' : 'text-[var(--muted)]'
          "
          @click="view = 'list'"
        >
          <List :size="16" /></button
        ><button
          class="grid h-8 w-8 place-items-center rounded-lg text-[var(--muted)] sm:hidden"
          aria-label="ترتيب المنتجات"
          @click="sortBy = sortBy === 'price-low' ? 'price-high' : 'price-low'"
        >
          <ArrowDownUp :size="15" />
        </button>
      </div>
    </div>
    <div
      v-if="filteredProducts.length && view === 'grid'"
      class="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4"
    >
      <ProductCard v-for="product in filteredProducts" :key="product.id" :product="product" />
    </div>
    <div v-else-if="filteredProducts.length" class="space-y-3">
      <RouterLink
        v-for="product in filteredProducts"
        :key="product.id"
        :to="`/product/${product.slug}`"
        class="flex items-center gap-4 rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-3 transition hover:border-[var(--line-strong)] sm:p-4"
        ><div class="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-[var(--elevated)]">
          <img
            :src="product.image"
            :alt="product.name"
            loading="lazy"
            class="h-full w-full object-cover opacity-70 mix-blend-screen"
          />
        </div>
        <div class="min-w-0 flex-1">
          <p class="text-[12px] font-bold uppercase text-[#E8A020]">
            {{ product.brand }} · {{ product.merchantName }}
          </p>
          <h2 class="mt-1 truncate text-sm font-semibold text-[var(--text)]">{{ product.name }}</h2>
          <p class="mt-1 text-[12px] text-[var(--muted)]">
            {{ product.volume }} · {{ product.base }} · {{ product.stock }} متوفر
          </p>
        </div>
        <div class="text-left">
          <p class="text-sm font-bold text-[var(--text)]">{{ formatPrice(product.price) }}</p>
          <span class="mt-2 flex items-center justify-start gap-1 text-[12px] text-[#E8A020]"
            ><Star :size="12" fill="currentColor" stroke="none" />{{ product.rating }}</span
          >
        </div></RouterLink
      >
    </div>
    <div v-else class="rounded-2xl border border-dashed border-[var(--line)] py-20 text-center">
      <Search :size="28" class="mx-auto text-[var(--muted)]" />
      <h2 class="mt-4 text-lg font-semibold text-[var(--text)]">لا توجد منتجات</h2>
      <p class="mt-2 text-sm text-[var(--muted)]">جرّب علامة تجارية أو لزوجة أو فلتر مختلفاً.</p>
      <button class="mt-5 text-xs font-bold text-[#E8A020]" @click="resetSearch">مسح البحث</button>
    </div>
  </div>
</template>

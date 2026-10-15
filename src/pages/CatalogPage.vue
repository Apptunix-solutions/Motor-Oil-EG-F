<script setup lang="ts">
import { formatPrice } from '@/lib/utils'
import { computed, ref } from 'vue'
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
import { RouterLink, useRoute } from 'vue-router'
import ProductCard from '@/components/product/ProductCard.vue'
import { UiSelect } from '@/components/ui'
import { products } from '@/data/products'
import type { ProductCategory } from '@/types/product'

const route = useRoute()
const query = ref(String(route.query.q ?? ''))
const selectedCategory = ref<ProductCategory | 'All'>(
  (route.query.category as ProductCategory | undefined) ?? 'All',
)
const selectedViscosity = ref('All')
const selectedBase = ref(String(route.query.base ?? 'All'))
const selectedBrands = ref<string[]>([])
const onlyAvailable = ref(false)
// Auto-open filters when arriving via a deep-link (?filter, ?base, ?category)
const showFilters = ref(!!(route.query.filter || route.query.base || route.query.category))
const view = ref<'grid' | 'list'>('grid')
const sortBy = ref<'featured' | 'price-low' | 'price-high' | 'rating'>(
  route.query.sort === 'rating' ? 'rating' : 'featured',
)
const categories: Array<ProductCategory | 'All'> = [
  'All',
  'Engine Oil',
  'Transmission',
  'Filters',
  'Coolants',
  'Grease',
]
const viscosities = ['All', '0W-20', '5W-30', '5W-40', '75W-90', '50/50']
const bases = ['All', 'Full Synthetic', 'Synthetic Blend', 'Mineral']
const brands = [...new Set(products.map((product) => product.brand))]
const sortOptions = [
  { label: 'Sort: Featured', value: 'featured' },
  { label: 'Top rated', value: 'rating' },
  { label: 'Price: low to high', value: 'price-low' },
  { label: 'Price: high to low', value: 'price-high' },
]
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
      `${product.name} ${product.brand} ${product.viscosity} ${product.base} ${product.tags.join(' ')}`.toLowerCase()
    const matchesQuery = searchable.includes(query.value.toLowerCase())
    const matchesCategory =
      selectedCategory.value === 'All' || product.category === selectedCategory.value
    const matchesViscosity =
      selectedViscosity.value === 'All' || product.viscosity === selectedViscosity.value
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
        <p class="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#F5A710]">
          The shop
        </p>
        <h1 class="display-font text-4xl font-bold tracking-[-0.06em] text-white sm:text-5xl">
          Find your fluid<span class="text-[#F5A710]">.</span>
        </h1>
        <p class="mt-3 max-w-md text-sm text-[#8E96A3]">
          Premium protection for every engine, from daily drivers to weekend machines.
        </p>
      </div>
      <div class="flex items-center gap-2 text-xs text-[#8E96A3]">
        <span class="grid h-8 w-8 place-items-center rounded-full bg-[#58D5E6]/10 text-[#58D5E6]"
          ><span class="h-2 w-2 rounded-full bg-[#58D5E6]"></span
        ></span>
        In stock and ready to ship
      </div>
    </div>
    <div
      class="sticky top-[72px] z-30 -mx-5 border-y border-white/[0.07] bg-[#0B0D10]/95 px-5 py-4 backdrop-blur-xl sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0"
    >
      <div class="flex gap-2">
        <label class="relative flex min-w-0 flex-1 items-center"
          ><span class="sr-only">Search products</span
          ><Search :size="17" class="absolute left-4 text-[#8E96A3]" /><input
            v-model="query"
            type="search"
            placeholder="Search by brand, viscosity or spec"
            class="h-12 w-full rounded-xl border border-white/10 bg-[#14171C] pl-11 pr-4 text-sm text-white outline-none placeholder:text-[#68707D] focus:border-[#F5A710]/60" /></label
        ><button
          class="relative grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-white/10 bg-[#14171C] text-[#A8AFBA] transition hover:border-white/20 hover:text-white sm:hidden"
          aria-label="Open filters"
          :aria-expanded="showFilters"
          @click="showFilters = !showFilters"
        >
          <Filter :size="18" /><span
            v-if="activeFilterCount"
            class="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-[#F5A710] px-1 text-[9px] font-bold text-[#0B0D10]"
            >{{ activeFilterCount }}</span
          ></button
        ><button
          class="hidden h-12 items-center gap-2 rounded-xl border border-white/10 bg-[#14171C] px-4 text-xs font-semibold text-[#A8AFBA] transition hover:text-white sm:flex"
          :aria-expanded="showFilters"
          @click="showFilters = !showFilters"
        >
          <SlidersHorizontal :size="16" /> Filters
          <span v-if="activeFilterCount" class="text-[#F5A710]">({{ activeFilterCount }})</span>
        </button>
      </div>
      <div
        class="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1"
        aria-label="Filter by category"
      >
        <button
          v-for="category in categories"
          :key="category"
          class="shrink-0 rounded-lg border px-3 py-2 text-[11px] font-semibold transition"
          :class="
            selectedCategory === category
              ? 'border-[#F5A710]/50 bg-[#F5A710]/10 text-[#F5A710]'
              : 'border-white/[0.08] text-[#8E96A3] hover:border-white/20 hover:text-white'
          "
          :aria-pressed="selectedCategory === category"
          @click="selectedCategory = category"
        >
          {{ category }}
        </button>
      </div>
    </div>
    <div v-if="showFilters" class="mt-5 rounded-2xl border border-white/10 bg-[#14171C] p-5 sm:p-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-sm font-semibold text-white">Tune your search</h2>
          <p class="mt-1 text-[11px] text-[#8E96A3]">
            Filter by fitment, formula, and availability.
          </p>
        </div>
        <button
          aria-label="Close filters"
          class="text-[#8E96A3] hover:text-white"
          @click="showFilters = false"
        >
          <X :size="17" />
        </button>
      </div>
      <div class="mt-6 grid gap-6 sm:grid-cols-3">
        <div>
          <p class="block mb-[10px] text-[11px] font-bold text-[#a8afba]">Brand</p>
          <div class="space-y-2">
            <label
              v-for="brand in brands"
              :key="brand"
              class="flex items-center gap-2 text-xs text-[#A8AFBA]"
              ><input
                type="checkbox"
                :checked="selectedBrands.includes(brand)"
                class="h-[15px] w-[15px] accent-[#f5a710]"
                @change="toggleBrand(brand)"
              />{{ brand }}</label
            >
          </div>
        </div>
        <label
          ><span class="block mb-[10px] text-[11px] font-bold text-[#a8afba]">Viscosity (SAE)</span
          ><UiSelect v-model="selectedViscosity" :options="viscosities" /></label
        ><label
          ><span class="block mb-[10px] text-[11px] font-bold text-[#a8afba]">Base formula</span
          ><UiSelect v-model="selectedBase" :options="bases"
        /></label>
      </div>
      <div
        class="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.08] pt-5"
      >
        <label class="flex items-center gap-2 text-xs text-[#A8AFBA]"
          ><input
            v-model="onlyAvailable"
            type="checkbox"
            class="h-[15px] w-[15px] accent-[#f5a710]"
          />
          Available now</label
        ><button class="text-xs font-bold text-[#F5A710]" @click="clearFilters">
          Clear all filters
        </button>
      </div>
    </div>
    <div class="mb-5 mt-9 flex flex-wrap items-center justify-between gap-3">
      <p class="text-xs text-[#8E96A3]">
        <span class="font-semibold text-white">{{ filteredProducts.length }} products</span> matched
        for you
      </p>
      <div class="flex items-center gap-2">
        <label class="sr-only" for="sort-products">Sort products</label
        ><UiSelect
          v-model="sortBy"
          :options="sortOptions"
          class="hidden h-8 w-[160px] rounded-lg border border-white/10 bg-[#14171C] px-2 text-[11px] font-semibold text-[#A8AFBA] outline-none transition focus:border-[#F5A710] focus:ring-1 focus:ring-[#F5A710]/50 sm:flex"
        /><button
          aria-label="Grid view"
          :aria-pressed="view === 'grid'"
          class="grid h-8 w-8 place-items-center rounded-lg"
          :class="view === 'grid' ? 'bg-white/10 text-white' : 'text-[#68707D]'"
          @click="view = 'grid'"
        >
          <LayoutGrid :size="16" /></button
        ><button
          aria-label="List view"
          :aria-pressed="view === 'list'"
          class="grid h-8 w-8 place-items-center rounded-lg"
          :class="view === 'list' ? 'bg-white/10 text-white' : 'text-[#68707D]'"
          @click="view = 'list'"
        >
          <List :size="16" /></button
        ><button
          class="grid h-8 w-8 place-items-center rounded-lg text-[#68707D] sm:hidden"
          aria-label="Sort products"
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
        class="flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-[#14171C] p-3 transition hover:border-white/20 sm:p-4"
        ><div class="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-[#20252C]">
          <img
            :src="product.image"
            :alt="product.name"
            class="h-full w-full object-cover opacity-70 mix-blend-screen"
          />
        </div>
        <div class="min-w-0 flex-1">
          <p class="text-[10px] font-bold uppercase tracking-[0.12em] text-[#F5A710]">
            {{ product.brand }} · {{ product.category }}
          </p>
          <h2 class="mt-1 truncate text-sm font-semibold text-white">{{ product.name }}</h2>
          <p class="mt-1 text-[11px] text-[#8E96A3]">
            {{ product.volume }} · {{ product.base }} · {{ product.stock }} in stock
          </p>
        </div>
        <div class="text-right">
          <p class="text-sm font-bold text-white">{{ formatPrice(product.price) }}</p>
          <span class="mt-2 flex items-center justify-end gap-1 text-[11px] text-[#F5A710]"
            ><Star :size="12" fill="currentColor" stroke="none" />{{ product.rating }}</span
          >
        </div></RouterLink
      >
    </div>
    <div v-else class="rounded-2xl border border-dashed border-white/10 py-20 text-center">
      <Search :size="28" class="mx-auto text-[#68707D]" />
      <h2 class="mt-4 text-lg font-semibold text-white">No fluids found</h2>
      <p class="mt-2 text-sm text-[#8E96A3]">
        Try a different brand, viscosity, or filter combination.
      </p>
      <button class="mt-5 text-xs font-bold text-[#F5A710]" @click="resetSearch">
        Clear search
      </button>
    </div>
  </div>
</template>

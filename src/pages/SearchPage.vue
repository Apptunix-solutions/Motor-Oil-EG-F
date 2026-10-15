<script setup lang="ts">
import { formatPrice } from '@/lib/utils'
import { computed, ref } from 'vue'
import { ArrowLeft, Clock3, Search, X } from 'lucide-vue-next'
import { RouterLink, useRouter } from 'vue-router'
import { products } from '@/data/products'

const router = useRouter()
const query = ref('')
const savedRecent = localStorage.getItem('motor-oil-eg-recent-searches')
const recent = ref<string[]>(
  savedRecent ? (JSON.parse(savedRecent) as string[]) : ['Castrol 5W-30', 'Mobil 1', 'API SP'],
)
const results = computed(() =>
  query.value.length > 1
    ? products.filter((product) =>
        `${product.name} ${product.brand} ${product.tags.join(' ')}`
          .toLowerCase()
          .includes(query.value.toLowerCase()),
      )
    : [],
)
function useRecent(value: string) {
  query.value = value
}
function clearRecent() {
  recent.value = []
  localStorage.removeItem('motor-oil-eg-recent-searches')
}
function openShop() {
  const value = query.value.trim()
  if (!value) return
  recent.value = [
    value,
    ...recent.value.filter((item) => item.toLowerCase() !== value.toLowerCase()),
  ].slice(0, 6)
  localStorage.setItem('motor-oil-eg-recent-searches', JSON.stringify(recent.value))
  router.push({ path: '/search', query: { q: value } })
}
</script>

<template>
  <div class="mx-auto max-w-3xl pb-12 pt-8 sm:pt-14">
    <RouterLink
      to="/"
      class="inline-flex items-center gap-2 text-xs font-semibold text-[#8E96A3] hover:text-white"
      ><ArrowLeft :size="15" /> Back home</RouterLink
    >
    <div class="mt-12 text-center">
      <p class="text-[10px] font-bold uppercase tracking-[0.18em] text-[#F5A710]">
        Search Motor-Oil-EG
      </p>
      <h1 class="display-font mt-2 text-4xl font-bold tracking-[-0.06em] text-white">
        What are you looking for<span class="text-[#F5A710]">?</span>
      </h1>
    </div>
    <label class="relative mt-9 flex items-center"
      ><Search :size="19" class="absolute left-5 text-[#8E96A3]" /><input
        v-model="query"
        autofocus
        type="search"
        placeholder="Try “5W-30”, “Mobil 1” or “API SP”"
        @keydown.enter="openShop"
        class="h-14 w-full rounded-2xl border border-white/10 bg-[#14171C] pl-13 pr-12 text-sm text-white outline-none placeholder:text-[#68707D] focus:border-[#F5A710]" /><button
        v-if="query"
        aria-label="Clear search"
        class="absolute right-4 text-[#8E96A3]"
        @click="query = ''"
      >
        <X :size="17" /></button
    ></label>
    <div v-if="!query" class="mt-8">
      <div class="flex items-center justify-between">
        <p class="text-[10px] font-bold uppercase tracking-[0.16em] text-[#8E96A3]">
          Recent searches
        </p>
        <button
          v-if="recent.length"
          class="text-[11px] text-[#68707D] hover:text-white"
          @click="clearRecent"
        >
          Clear
        </button>
      </div>
      <div class="mt-4 space-y-2">
        <button
          v-for="item in recent"
          :key="item"
          class="flex w-full items-center gap-3 rounded-xl border border-white/[0.07] bg-[#14171C] px-4 py-3 text-left text-xs text-[#A8AFBA] hover:border-white/20 hover:text-white"
          @click="useRecent(item)"
        >
          <Clock3 :size="15" class="text-[#68707D]" />{{ item }}
        </button>
      </div>
    </div>
    <div v-else class="mt-8">
      <div v-if="results.length" class="space-y-2">
        <button
          v-for="product in results"
          :key="product.id"
          class="flex w-full items-center gap-4 rounded-xl border border-white/[0.07] bg-[#14171C] p-3 text-left hover:border-[#F5A710]/40"
          @click="router.push(`/product/${product.slug}`)"
        >
          <img
            :src="product.image"
            :alt="product.name"
            class="h-12 w-12 rounded-lg object-cover opacity-70 mix-blend-screen"
          /><span class="flex-1"
            ><strong class="block text-sm text-white">{{ product.name }}</strong
            ><span class="mt-1 block text-[11px] text-[#8E96A3]"
              >{{ product.brand }} · {{ product.viscosity }}</span
            ></span
          ><span class="text-sm font-bold text-white">{{ formatPrice(product.price) }}</span>
        </button>
      </div>
      <div v-else class="py-12 text-center">
        <p class="text-sm text-[#8E96A3]">No exact matches yet.</p>
        <button class="mt-4 text-xs font-bold text-[#F5A710]" @click="openShop">
          Browse all products
        </button>
      </div>
    </div>
  </div>
</template>

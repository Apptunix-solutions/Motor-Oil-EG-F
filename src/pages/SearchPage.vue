<script setup lang="ts">
import { formatPrice } from '@/lib/utils'
import { readStoredJson } from '@/lib/storage'
import { computed, ref } from 'vue'
import { ArrowRight, Clock3, Search, X } from 'lucide-vue-next'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { products } from '@/data/products'

const route = useRoute()
const router = useRouter()
/** البدء بكلمة البحث القادمة من الرابط ‎/search?q=‎ مباشرة */
const query = ref(String(route.query.q ?? ''))
// قراءة آمنة: مصفوفة بحث تالفة في التخزين لا تُسقط الصفحة.
const recent = ref<string[]>(
  readStoredJson<string[]>(
    'zaytstore-recent-searches',
    ['زيت رانيول', '5W-30', 'زيت لومو'],
    (value) => Array.isArray(value) && value.every((item) => typeof item === 'string'),
  ),
)
const results = computed(() =>
  query.value.length > 1
    ? products.filter((product) =>
        `${product.name} ${product.brand} ${product.merchantName} ${product.tags.join(' ')}`
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
  localStorage.removeItem('zaytstore-recent-searches')
}
function openShop() {
  const value = query.value.trim()
  if (!value) return
  recent.value = [
    value,
    ...recent.value.filter((item) => item.toLowerCase() !== value.toLowerCase()),
  ].slice(0, 6)
  localStorage.setItem('zaytstore-recent-searches', JSON.stringify(recent.value))
  router.push({ path: '/search', query: { q: value } })
}
</script>

<template>
  <div class="mx-auto max-w-3xl pb-12 pt-8 sm:pt-14">
    <RouterLink
      to="/"
      class="inline-flex items-center gap-2 text-xs font-semibold text-[var(--muted)] hover:text-[var(--text)]"
      ><ArrowRight :size="15" /> الرئيسية</RouterLink
    >
    <div class="mt-12 text-center">
      <p class="text-[12px] font-bold uppercase text-[#E8A020]">ابحث في ZaytStore</p>
      <h1 class="display-font mt-2 text-4xl font-bold text-[var(--text)]">
        ما الذي تبحث عنه<span class="text-[#E8A020]">؟</span>
      </h1>
    </div>
    <label class="relative mt-9 flex items-center"
      ><Search :size="19" class="absolute right-5 text-[var(--muted)]" /><input
        v-model="query"
        autofocus
        type="search"
        placeholder="جرّب «5W-30» أو «رانيول» أو «مصافي»"
        @keydown.enter="openShop"
        class="h-14 w-full rounded-2xl border border-[var(--line)] bg-[var(--panel)] pr-13 pl-12 text-sm text-[var(--text)] outline-none placeholder:text-[var(--muted)] focus:border-[#E8A020]" /><button
        v-if="query"
        aria-label="مسح البحث"
        class="absolute left-4 text-[var(--muted)]"
        @click="query = ''"
      >
        <X :size="17" /></button
    ></label>
    <div v-if="!query" class="mt-8">
      <div class="flex items-center justify-between">
        <p class="text-[12px] font-bold uppercase text-[var(--muted)]">عمليات بحث سابقة</p>
        <button
          v-if="recent.length"
          class="text-[12px] text-[var(--muted)] hover:text-[var(--text)]"
          @click="clearRecent"
        >
          مسح
        </button>
      </div>
      <div class="mt-4 space-y-2">
        <button
          v-for="item in recent"
          :key="item"
          class="flex w-full items-center gap-3 rounded-xl border border-[var(--line)] bg-[var(--panel)] px-4 py-3 text-right text-xs text-[var(--soft)] hover:border-[var(--line-strong)] hover:text-[var(--text)]"
          @click="useRecent(item)"
        >
          <Clock3 :size="15" class="text-[var(--muted)]" />{{ item }}
        </button>
      </div>
    </div>
    <div v-else class="mt-8">
      <div v-if="results.length" class="space-y-2">
        <button
          v-for="product in results"
          :key="product.id"
          class="flex w-full items-center gap-4 rounded-xl border border-[var(--line)] bg-[var(--panel)] p-3 text-right hover:border-[#E8A020]/40"
          @click="router.push(`/product/${product.slug}`)"
        >
          <img
            :src="product.image"
            :alt="product.name"
            class="h-12 w-12 rounded-lg bg-[var(--elevated)] object-contain p-1"
          /><span class="flex-1"
            ><strong class="block text-sm text-[var(--text)]">{{ product.name }}</strong
            ><span class="mt-1 block text-[12px] text-[var(--muted)]"
              >{{ product.brand }} · {{ product.merchantName }}</span
            ></span
          ><span class="text-sm font-bold text-[var(--text)]">{{
            formatPrice(product.price)
          }}</span>
        </button>
      </div>
      <div v-else class="py-12 text-center">
        <p class="text-sm text-[var(--muted)]">لا توجد نتائج مطابقة بعد.</p>
        <button class="mt-4 text-xs font-bold text-[#E8A020]" @click="openShop">
          تصفّح كل المنتجات
        </button>
      </div>
    </div>
  </div>
</template>

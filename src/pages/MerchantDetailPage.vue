<script setup lang="ts">
import { computed, ref } from 'vue'
import { ArrowRight, Phone, Star, Store, Truck, ShieldCheck, PackageCheck } from 'lucide-vue-next'
import { RouterLink, useRoute } from 'vue-router'
import ProductCard from '@/components/product/ProductCard.vue'
import { merchantById, merchants } from '@/data/merchants'
import { products } from '@/data/products'
import { categoryLabel } from '@/data/categories'
import ErrorPage from '@/pages/ErrorPage.vue'

const route = useRoute()
const merchant = computed(() => merchantById(String(route.params.id)))
const merchantProducts = computed(() =>
  products.filter((product) => product.merchantId === merchant.value?.id),
)
const foundedIndex = computed(() =>
  merchant.value ? merchants.findIndex((entry) => entry.id === merchant.value?.id) : -1,
)
const relatedMerchants = computed(() =>
  merchants
    .filter((entry) => entry.id !== merchant.value?.id)
    .slice(Math.max(0, foundedIndex.value - 1), Math.max(0, foundedIndex.value - 1) + 3),
)
const activeCategory = ref('all')
const visibleProducts = computed(() =>
  activeCategory.value === 'all'
    ? merchantProducts.value
    : merchantProducts.value.filter((product) => product.category === activeCategory.value),
)
const productCategories = computed(() => {
  const seen = new Set<string>()
  return merchantProducts.value
    .map((product) => product.category)
    .filter((value) => (seen.has(value) ? false : (seen.add(value), true)))
})
</script>

<template>
  <ErrorPage v-if="!merchant" kind="not-found" />
  <div v-else class="pb-12 pt-8 sm:pt-12">
    <RouterLink
      to="/merchants"
      class="inline-flex items-center gap-2 text-xs font-semibold text-[var(--muted)] hover:text-[var(--text)]"
      ><ArrowRight :size="15" /> كل المتاجر</RouterLink
    >

    <!-- بطاقة المتجر -->
    <section
      class="mt-6 overflow-hidden rounded-[26px] border border-[var(--line)] bg-gradient-to-bl from-[#0F3D20] to-[#0B0D10]"
    >
      <div class="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:p-8">
        <span
          class="grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-full border-2 border-[#E8A020]/40 bg-[var(--elevated)] text-4xl font-bold text-[#E8A020]"
        >
          <img
            v-if="merchant.image"
            :src="merchant.image"
            :alt="merchant.name"
            class="h-full w-full object-cover"
          />
          <template v-else>{{ merchant.name.charAt(0) }}</template>
        </span>

        <div class="min-w-0 flex-1">
          <div class="flex flex-wrap items-center gap-2">
            <span
              v-if="merchant.isFounder"
              class="inline-flex items-center gap-1.5 rounded-full border border-[#E8A020]/30 bg-[#E8A020]/10 px-2.5 py-1 text-xs font-bold text-[#E8A020]"
              ><Star :size="12" fill="currentColor" stroke="none" /> مؤسس</span
            >
            <span
              class="inline-flex items-center gap-1.5 rounded-full border border-[var(--line-strong)] bg-[var(--glass)] px-2.5 py-1 text-xs font-semibold text-[var(--muted)]"
              ><Store :size="12" /> متجر موثّق</span
            >
          </div>

          <h1 class="display-font mt-3 text-3xl font-bold text-[var(--text)] sm:text-4xl">
            {{ merchant.name }}
          </h1>
          <p class="mt-2 text-sm leading-relaxed text-white/70">{{ merchant.tagline }}</p>

          <div class="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
            <span
              v-if="merchant.reviewCount > 0"
              class="flex items-center gap-1.5 text-sm font-semibold text-[#E8A020]"
            >
              <Star :size="15" fill="currentColor" stroke="none" />
              {{ merchant.rating.toFixed(1) }}
              <span class="font-normal text-white/55">({{ merchant.reviewCount }} تقييم)</span>
            </span>
            <span class="text-sm text-white/55">{{ merchantProducts.length }} منتج معروض</span>
          </div>

          <div class="mt-5 flex flex-wrap gap-3">
            <a
              v-if="merchant.phone"
              :href="`tel:${merchant.phone}`"
              class="inline-flex h-11 items-center gap-2 rounded-xl bg-[#E8A020] px-5 text-sm font-bold text-[#071F0D] transition hover:bg-[#F5C060]"
              ><Phone :size="15" /> {{ merchant.phone }}</a
            >
            <a
              v-if="merchant.phone"
              :href="`https://wa.me/963${merchant.phone.replace(/^0/, '')}`"
              target="_blank"
              rel="noreferrer"
              class="inline-flex h-11 items-center gap-2 rounded-xl border border-[var(--line-strong)] bg-[var(--glass-strong)] px-5 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--glass-strong)]"
              >واتساب التاجر</a
            >
          </div>
        </div>
      </div>

      <div
        class="grid grid-cols-2 gap-px border-t border-[var(--line)] bg-[var(--glass-strong)] sm:grid-cols-3"
      >
        <div class="flex items-center gap-3 bg-[var(--bg)] px-5 py-4">
          <PackageCheck :size="18" class="shrink-0 text-[#E8A020]" />
          <p class="text-xs text-[var(--muted)]">منتجات أصلية 100%</p>
        </div>
        <div class="flex items-center gap-3 bg-[var(--bg)] px-5 py-4">
          <ShieldCheck :size="18" class="shrink-0 text-[#E8A020]" />
          <p class="text-xs text-[var(--muted)]">مراجعة قبل التفعيل</p>
        </div>
        <div class="col-span-2 flex items-center gap-3 bg-[var(--bg)] px-5 py-4 sm:col-span-1">
          <Truck :size="18" class="shrink-0 text-[#E8A020]" />
          <p class="text-xs text-[var(--muted)]">توصيل لمعظم المحافظات السورية</p>
        </div>
      </div>
    </section>

    <!-- منتجات المتجر -->
    <section class="mt-10">
      <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p class="mb-2 text-xs font-bold uppercase text-[#E8A020]">منتجات المتجر</p>
          <h2 class="display-font text-2xl font-bold text-[var(--text)] sm:text-3xl">
            تسوّق من {{ merchant.name }}
          </h2>
        </div>
        <RouterLink
          v-if="merchantProducts.length"
          to="/products"
          class="group flex items-center gap-2 border-b border-[#E8A020]/50 pb-1 text-xs font-medium uppercase text-[var(--muted)] transition hover:text-[var(--text)]"
          >كل المنتجات
          <ArrowRight :size="13" class="text-[#E8A020] transition group-hover:translate-x-0.5"
        /></RouterLink>
      </div>

      <div
        v-if="productCategories.length > 1"
        class="no-scrollbar mb-6 flex gap-2 overflow-x-auto pb-1"
      >
        <button
          class="shrink-0 rounded-lg border px-3.5 py-2 text-xs font-semibold transition"
          :class="
            activeCategory === 'all'
              ? 'border-[#E8A020]/50 bg-[#E8A020]/10 text-white'
              : 'border-[var(--line)] bg-[var(--panel)] text-[var(--soft)] hover:border-[var(--line-strong)]'
          "
          :aria-pressed="activeCategory === 'all'"
          @click="activeCategory = 'all'"
        >
          الكل
        </button>
        <button
          v-for="category in productCategories"
          :key="category"
          class="shrink-0 rounded-lg border px-3.5 py-2 text-xs font-semibold transition"
          :class="
            activeCategory === category
              ? 'border-[#E8A020]/50 bg-[#E8A020]/10 text-white'
              : 'border-[var(--line)] bg-[var(--panel)] text-[var(--soft)] hover:border-[var(--line-strong)]'
          "
          :aria-pressed="activeCategory === category"
          @click="activeCategory = category"
        >
          {{ categoryLabel(category) }}
        </button>
      </div>

      <div v-if="visibleProducts.length" class="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        <ProductCard v-for="product in visibleProducts" :key="product.id" :product="product" />
      </div>

      <div
        v-else
        class="rounded-[22px] border border-dashed border-[var(--line-strong)] bg-[var(--panel)] px-6 py-12 text-center"
      >
        <Store :size="34" class="mx-auto text-[#E8A020]" />
        <p class="mt-4 text-sm font-bold text-[var(--text)]">لا توجد منتجات معروضة حالياً</p>
        <p class="mt-2 text-xs leading-relaxed text-[var(--muted)]">
          يعمل {{ merchant.name }} على إضافة منتجاته قريباً — في هذه الأثناء تصفّح باقي المتاجر
          والمنتجات.
        </p>
        <RouterLink
          to="/products"
          class="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-[#E8A020] px-6 text-sm font-bold text-[#071F0D] transition hover:bg-[#F5C060]"
          >تصفح كل المنتجات</RouterLink
        >
      </div>
    </section>

    <!-- متاجر أخرى -->
    <section v-if="relatedMerchants.length" class="mt-12 border-t border-[var(--line)] pt-10">
      <div class="mb-6 flex items-end justify-between gap-4">
        <div>
          <p class="mb-2 text-xs font-bold uppercase text-[#E8A020]">قد يعجبك أيضاً</p>
          <h2 class="display-font text-2xl font-bold text-[var(--text)] sm:text-3xl">متاجر أخرى</h2>
        </div>
        <RouterLink
          to="/merchants"
          class="shrink-0 text-xs font-semibold text-[#E8A020] transition hover:text-[var(--text)]"
          >كل المتاجر ←</RouterLink
        >
      </div>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <RouterLink
          v-for="entry in relatedMerchants"
          :key="entry.id"
          :to="`/merchants/${entry.id}`"
          class="group flex flex-col items-center gap-3 rounded-[22px] border border-[var(--line)] bg-[var(--panel)] p-6 text-center transition hover:-translate-y-1 hover:border-[#E8A020]/40"
        >
          <span
            class="grid h-16 w-16 place-items-center overflow-hidden rounded-full border-2 border-[var(--line)] bg-[var(--elevated)] text-2xl font-bold text-[#E8A020]"
          >
            <img
              v-if="entry.image"
              :src="entry.image"
              :alt="entry.name"
              class="h-full w-full object-cover"
            />
            <template v-else>{{ entry.name.charAt(0) }}</template>
          </span>
          <h3 class="text-xs font-bold text-[var(--text)] transition group-hover:text-[#E8A020]">
            {{ entry.name }}
          </h3>
          <p class="text-xs leading-relaxed text-[var(--muted)]">{{ entry.tagline }}</p>
        </RouterLink>
      </div>
    </section>
  </div>
</template>

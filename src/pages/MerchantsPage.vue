<script setup lang="ts">
import { computed } from 'vue'
import { Phone, Search, Star, Store } from 'lucide-vue-next'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { merchants } from '@/data/merchants'
import { products } from '@/data/products'

const route = useRoute()
const router = useRouter()
/** تصفية حية حسب كلمة البحث القادمة من رابط ‎/merchants?q=‎ */
const query = computed(() =>
  String(route.query.q ?? '')
    .trim()
    .toLowerCase(),
)
const totalProducts = products.length
const visibleMerchants = computed(() =>
  query.value
    ? merchants.filter((merchant) =>
        `${merchant.name} ${merchant.tagline}`.toLowerCase().includes(query.value),
      )
    : merchants,
)
/** تحديث كلمة البحث في الرابط دون إعادة تحميل الصفحة (‎?q=‎). */
function setSearch(event: Event) {
  const value = (event.target as HTMLInputElement).value.trim()
  void router.replace({ path: '/merchants', query: value ? { q: value } : {} })
}
</script>

<template>
  <div class="pb-12 pt-8 sm:pt-12">
    <p class="text-[12px] font-bold uppercase text-[#E8A020]">المتاجر</p>
    <h1 class="display-font mt-2 text-4xl font-bold text-[var(--text)] sm:text-5xl">
      تصفح المتاجر<span class="text-[#E8A020]">.</span>
    </h1>
    <p class="mt-3 max-w-xl text-sm leading-relaxed text-[var(--muted)]">
      اختر من أفضل تجار الزيوت وقطع الغيار في سوريا — {{ merchants.length }} متجر موثّق على
      ZaytStore.
    </p>

    <div
      class="mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-[var(--line)] bg-[var(--panel)] px-4 py-3 text-xs text-[var(--soft)]"
    >
      <Store :size="16" class="text-[#E8A020]" />
      <span class="font-semibold text-[var(--text)]">{{ merchants.length }} متجر</span>
      <span class="h-3 w-px bg-[var(--line-strong)]"></span>
      <span>{{ totalProducts }} منتج متاح</span>
    </div>

    <!-- بحث داخل قائمة المتاجر (يقرأ ويكتب ‎?q=‎ في الرابط) -->
    <label class="relative mt-4 flex items-center"
      ><Search :size="18" class="absolute right-4 text-[var(--muted)]" /><input
        :value="route.query.q ?? ''"
        type="search"
        placeholder="ابحث عن متجر…"
        aria-label="ابحث عن متجر"
        class="h-12 w-full rounded-2xl border border-[var(--line)] bg-[var(--panel)] pr-12 pl-4 text-sm text-[var(--text)] placeholder:text-[var(--muted)] focus:border-[#E8A020] focus:outline-none"
        @input="setSearch"
    /></label>

    <p
      v-if="query && !visibleMerchants.length"
      class="mt-8 rounded-[22px] border border-dashed border-[var(--line-strong)] bg-[var(--panel)] px-6 py-10 text-center text-sm text-[var(--muted)]"
    >
      لا يوجد متجر يطابق «{{ String(route.query.q) }}».
    </p>

    <div v-else class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <RouterLink
        v-for="merchant in visibleMerchants"
        :key="merchant.id"
        :to="`/merchants/${merchant.id}`"
        class="group flex flex-col items-center gap-3 rounded-[22px] border border-[var(--line)] bg-[var(--panel)] p-6 text-center transition hover:-translate-y-1 hover:border-[#E8A020]/40"
      >
        <span
          v-if="merchant.isFounder"
          class="inline-flex items-center gap-1.5 rounded-full border border-[#E8A020]/30 bg-[#E8A020]/10 px-2.5 py-1 text-[12px] font-bold text-[#E8A020]"
          ><Star :size="11" fill="currentColor" stroke="none" /> مؤسس</span
        >
        <span
          class="grid h-20 w-20 place-items-center overflow-hidden rounded-full border-2 border-[var(--line)] bg-[var(--elevated)] text-3xl font-bold text-[#E8A020]"
        >
          <img
            v-if="merchant.image"
            :src="merchant.image"
            :alt="merchant.name"
            class="h-full w-full object-cover"
          />
          <template v-else>{{ merchant.name.charAt(0) }}</template>
        </span>

        <h2 class="text-sm font-bold text-[var(--text)] transition group-hover:text-[#E8A020]">
          {{ merchant.name }}
        </h2>

        <p
          v-if="merchant.reviewCount > 0"
          class="flex items-center gap-1 text-xs font-semibold text-[#E8A020]"
        >
          <Star :size="13" fill="currentColor" stroke="none" />
          {{ merchant.rating.toFixed(1) }}
          <span class="font-normal text-[var(--muted)]">({{ merchant.reviewCount }})</span>
        </p>
        <p v-else class="text-xs text-[var(--muted)]">لا توجد تقييمات بعد</p>

        <p class="min-h-[34px] text-[12px] leading-relaxed text-[var(--muted)]">
          {{ merchant.tagline }}
        </p>

        <span
          v-if="merchant.phone"
          class="flex items-center gap-1.5 text-[12px] font-semibold text-[#E8A020]"
          ><Phone :size="12" /> {{ merchant.phone }}</span
        >

        <span
          class="mt-1 inline-flex h-9 items-center rounded-xl bg-[#E8A020] px-5 text-xs font-bold text-[#071F0D] transition group-hover:bg-[#F5C060]"
          >تسوق الآن</span
        >
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatPrice } from '@/lib/utils'
import { Check, Heart, ShoppingCart, Star } from 'lucide-vue-next'
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useWishlistStore } from '@/stores/wishlist'
import type { Product } from '@/types/product'
import { UiCard } from '@/components/ui'

const props = defineProps<{ product: Product }>()
const cart = useCartStore()
const wishlist = useWishlistStore()
const quantity = computed(() => cart.quantity(props.product.id))
const saved = computed(() => wishlist.has(props.product.id))

function addToCart() {
  cart.add(props.product)
}

function toggleSaved() {
  wishlist.toggle(props.product.id)
}
</script>

<template>
  <UiCard
    as="article"
    class="product-card group relative min-w-0 overflow-hidden rounded-[20px] border-none bg-[var(--elevated)] p-0 shadow-none transition duration-300 hover:-translate-y-1 hover:bg-[var(--elevated)]"
  >
    <div class="product-visual relative aspect-[1.1] overflow-hidden">
      <RouterLink
        :to="`/product/${product.slug}`"
        class="absolute inset-0 grid place-items-center p-6"
        :aria-label="`عرض ${product.name}`"
        ><img
          :src="product.image"
          :alt="product.name"
          loading="lazy"
          class="h-full w-full object-contain transition duration-500 group-hover:scale-105"
      /></RouterLink>

      <!-- Sale / stock label -->
      <span
        v-if="product.stock === 0"
        class="absolute right-4 top-4 rounded-md bg-[var(--bg)]/85 px-2 py-1 text-[12px] font-bold text-[#E8A020]"
        >نفذ المخزون</span
      >
      <span
        v-else-if="product.isBestseller"
        class="absolute right-4 top-4 rounded-md bg-[var(--bg)]/85 px-2 py-1 text-[12px] font-bold text-[#E8A020]"
        >الأكثر مبيعاً</span
      >

      <!-- Cart Button Cutout Wrapper -->
      <div class="absolute left-0 top-0 rounded-br-[20px] bg-ink pr-1.5 pb-1.5">
        <div class="relative bg-[var(--elevated)] rounded-br-[16px] rounded-tl-[20px]">
          <button
            class="cart-button grid h-9 w-[52px] place-items-center rounded-br-[16px] rounded-bl-[4px] rounded-tr-[4px] rounded-tl-[16px] bg-[#E8A020] text-[#071F0D] transition hover:bg-[#F5C060] disabled:opacity-50"
            :disabled="product.stock === 0"
            :aria-label="`أضف ${product.name} إلى السلة`"
            @click.stop="addToCart"
          >
            <Check v-if="quantity" :size="20" stroke-width="3" />
            <ShoppingCart v-else :size="20" stroke-width="2.5" />
          </button>
        </div>
      </div>
    </div>

    <div class="product-info px-4 pb-4 pt-1">
      <div class="min-h-[42px]">
        <RouterLink
          :to="`/product/${product.slug}`"
          class="line-clamp-2 text-[13px] font-medium leading-[1.4] text-[var(--text)] transition hover:text-[#E8A020]"
          >{{ product.name }}</RouterLink
        >
      </div>

      <p class="mt-1 text-[12px] font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
        {{ product.brand }} · {{ product.merchantName }}
      </p>

      <div class="mt-2 flex items-center gap-2 text-[12px] font-medium">
        <span class="flex items-center gap-1.5 text-[#E8A020]"
          ><Star :size="12" fill="currentColor" stroke-width="0" />{{
            product.rating.toFixed(1)
          }}</span
        >
        <span class="text-[var(--muted)]">{{ product.reviewCount }} تقييم</span>
      </div>

      <div class="mt-4 flex items-end justify-between gap-2">
        <div class="flex flex-col leading-tight">
          <span
            v-if="product.originalPrice"
            class="mb-0.5 text-[12px] font-medium text-[var(--muted)] line-through decoration-[var(--muted)]"
            >{{ formatPrice(product.originalPrice) }}</span
          >
          <span class="text-[18px] font-medium text-[var(--text)]">{{
            formatPrice(product.price)
          }}</span>
        </div>
        <button
          class="favorite-button mb-0.5 grid h-8 w-8 place-items-center text-[#E8A020] transition hover:scale-110"
          :aria-label="saved ? `إزالة ${product.name} من المفضلة` : `حفظ ${product.name}`"
          :aria-pressed="saved"
          @click.stop="toggleSaved"
        >
          <Heart :size="22" :fill="saved ? 'currentColor' : 'none'" stroke-width="1.5" />
        </button>
      </div>
    </div>
  </UiCard>
</template>

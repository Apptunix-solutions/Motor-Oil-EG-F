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
    class="product-card group relative min-w-0 overflow-hidden rounded-[20px] border-none bg-[#292A2D] p-0 shadow-none transition duration-300 hover:-translate-y-1 hover:bg-[#333438]"
  >
    <div class="product-visual relative aspect-[1.1] overflow-hidden">
      <RouterLink
        :to="`/product/${product.slug}`"
        class="absolute inset-0 grid place-items-center p-6"
        :aria-label="`View ${product.name}`"
        ><img
          :src="product.image"
          :alt="product.name"
          class="h-full w-full object-contain transition duration-500 group-hover:scale-105"
      /></RouterLink>

      <!-- Sale Label -->
      <span class="absolute left-4 top-4 text-[13px] font-medium tracking-wide text-[#68696A]"
        >SALE</span
      >

      <!-- Cart Button Cutout Wrapper -->
      <div class="absolute right-0 top-0 rounded-bl-[20px] bg-ink pl-1.5 pb-1.5">
        <div class="relative bg-[#292A2D] rounded-bl-[16px] rounded-tr-[20px]">
          <button
            class="cart-button grid h-9 w-[52px] place-items-center rounded-bl-[16px] rounded-br-[4px] rounded-tl-[4px] rounded-tr-[16px] bg-[#F5A710] text-[#0B0D10] transition hover:bg-[#FFC233]"
            :aria-label="`Add ${product.name} to cart`"
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
          class="line-clamp-2 text-[13px] font-medium uppercase leading-[1.4] text-white/90 transition hover:text-[#F5A710]"
          >{{ product.brand }} {{ product.name }}</RouterLink
        >
      </div>

      <div class="mt-2.5 flex items-center gap-2 text-[11px] font-medium">
        <span class="flex items-center gap-1.5 text-[#F5A710]"
          ><Star :size="12" fill="currentColor" stroke-width="0" />{{
            product.rating.toFixed(1)
          }}</span
        >
        <span class="text-[#68696A]">{{ product.reviewCount }} reviews</span>
      </div>

      <div class="mt-5 flex items-end justify-between gap-2">
        <div class="flex flex-col leading-tight">
          <span
            v-if="product.originalPrice"
            class="mb-0.5 text-[12px] font-medium text-[#68696A] line-through decoration-[#68696A]"
            >{{ formatPrice(product.originalPrice) }}</span
          >
          <span class="text-[18px] font-medium text-white">{{ formatPrice(product.price) }}</span>
        </div>
        <button
          class="favorite-button mb-0.5 grid h-8 w-8 place-items-center text-[#F5A710] transition hover:scale-110"
          :aria-label="saved ? `Remove ${product.name} from wishlist` : `Save ${product.name}`"
          :aria-pressed="saved"
          @click.stop="toggleSaved"
        >
          <Heart :size="22" :fill="saved ? 'currentColor' : 'none'" stroke-width="1.5" />
        </button>
      </div>
    </div>
  </UiCard>
</template>

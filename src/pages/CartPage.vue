<script setup lang="ts">
import { ArrowRight, ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/stores/cart'

const cart = useCartStore()
</script>

<template>
  <div class="pb-12 pt-8 sm:pt-14">
    <RouterLink
      to="/catalog"
      class="inline-flex items-center gap-2 text-xs font-semibold text-[#8E96A3] hover:text-white"
      ><ArrowLeft :size="15" /> Continue shopping</RouterLink
    >
    <div v-if="cart.lines.length" class="mt-9 grid gap-8 lg:grid-cols-[1fr_360px]">
      <div>
        <div class="flex items-end justify-between">
          <div>
            <p class="text-[10px] font-bold uppercase tracking-[0.18em] text-[#F5A710]">Your bag</p>
            <h1 class="display-font mt-2 text-4xl font-bold tracking-[-0.06em] text-white">
              Ready for the road<span class="text-[#F5A710]">.</span>
            </h1>
          </div>
          <span class="text-xs text-[#8E96A3]">{{ cart.count }} items</span>
        </div>
        <div class="mt-8 space-y-3">
          <div
            v-for="line in cart.lines"
            :key="line.product.id"
            class="flex gap-4 rounded-2xl border border-white/[0.08] bg-[#14171C] p-3 sm:p-4"
          >
            <RouterLink
              :to="`/product/${line.product.slug}`"
              class="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-[#22262E] sm:h-28 sm:w-28"
              ><img
                :src="line.product.image"
                :alt="line.product.name"
                class="h-full w-full object-cover mix-blend-screen"
            /></RouterLink>
            <div class="min-w-0 flex-1 py-1">
              <div class="flex justify-between gap-3">
                <div>
                  <p class="text-[10px] font-bold uppercase tracking-[0.12em] text-[#F5A710]">
                    {{ line.product.brand }}
                  </p>
                  <h2 class="mt-1 truncate text-sm font-semibold text-white">
                    {{ line.product.name }}
                  </h2>
                  <p class="mt-1 text-[11px] text-[#8E96A3]">
                    {{ line.product.volume }} · {{ line.product.viscosity }}
                  </p>
                </div>
                <button
                  aria-label="Remove item"
                  class="text-[#68707D] hover:text-[#F5A710]"
                  @click="cart.clear(line.product.id)"
                >
                  <Trash2 :size="16" />
                </button>
              </div>
              <div class="mt-4 flex items-center justify-between">
                <div class="flex h-8 items-center rounded-lg border border-white/10">
                  <button
                    class="grid h-8 w-8 place-items-center text-[#8E96A3]"
                    aria-label="Decrease quantity"
                    @click="cart.remove(line.product.id)"
                  >
                    <Minus :size="13" /></button
                  ><span class="w-5 text-center text-xs font-bold">{{ line.quantity }}</span
                  ><button
                    class="grid h-8 w-8 place-items-center text-[#8E96A3]"
                    aria-label="Increase quantity"
                    @click="cart.add(line.product)"
                  >
                    <Plus :size="13" />
                  </button>
                </div>
                <strong class="text-sm text-white">{{
                  formatPrice(line.product.price * line.quantity)
                }}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
      <aside class="h-fit rounded-[24px] border border-white/[0.08] bg-[#14171C] p-5 sm:p-7">
        <h2 class="display-font text-xl font-bold text-white">Order summary</h2>
        <div class="mt-6 space-y-3 border-b border-white/[0.08] pb-5 text-xs">
          <div class="flex justify-between text-[#8E96A3]">
            <span>Subtotal</span><span class="text-white">{{ formatPrice(cart.subtotal) }}</span>
          </div>
          <div class="flex justify-between text-[#8E96A3]">
            <span>Shipping</span><span class="text-[#58D5E6]">Free</span>
          </div>
        </div>
        <div class="mt-5 flex justify-between">
          <span class="text-sm font-semibold text-white">Total</span
          ><strong class="display-font text-2xl text-white">{{
            formatPrice(cart.subtotal)
          }}</strong>
        </div>
        <RouterLink
          to="/checkout"
          class="mt-6 flex h-12 items-center justify-center gap-2 rounded-xl bg-[#F5A710] text-sm font-bold text-[#0B0D10] hover:bg-[#FFC233]"
          >Checkout <ArrowRight :size="16"
        /></RouterLink>
        <p class="mt-4 text-center text-[10px] text-[#68707D]">Cash on delivery · 30-day returns</p>
      </aside>
    </div>
    <div v-else class="flex min-h-[65vh] items-center justify-center py-16">
      <div class="text-center">
        <div
          class="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#F5A710]/10 text-[#F5A710]"
        >
          <ShoppingBag :size="28" />
        </div>
        <h1 class="display-font mt-7 text-3xl font-bold tracking-[-0.05em] text-white">
          Your bag is waiting.
        </h1>
        <p class="mt-3 text-sm text-[#8E96A3]">
          Add something good for your engine and it’ll show up here.
        </p>
        <RouterLink
          to="/catalog"
          class="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#F5A710] px-5 py-3 text-xs font-bold text-[#0B0D10]"
          >Explore the shop <ArrowRight :size="15"
        /></RouterLink>
      </div>
    </div>
  </div>
</template>

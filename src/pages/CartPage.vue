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
      to="/products"
      class="inline-flex items-center gap-2 text-xs font-semibold text-[var(--muted)] hover:text-[var(--text)]"
      ><ArrowRight :size="15" /> متابعة التسوق</RouterLink
    >
    <div v-if="cart.lines.length" class="mt-9 grid gap-8 lg:grid-cols-[1fr_360px]">
      <div>
        <div class="flex items-end justify-between">
          <div>
            <p class="text-[12px] font-bold uppercase text-[#E8A020]">سلتك</p>
            <h1 class="display-font mt-2 text-4xl font-bold text-[var(--text)]">
              جاهز للطريق<span class="text-[#E8A020]">.</span>
            </h1>
          </div>
          <span class="text-xs text-[var(--muted)]">{{ cart.count }} عنصر</span>
        </div>
        <div class="mt-8 space-y-3">
          <div
            v-for="line in cart.lines"
            :key="line.product.id"
            class="flex gap-4 rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-3 sm:p-4"
          >
            <RouterLink
              :to="`/product/${line.product.slug}`"
              class="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-[#22262E] sm:h-28 sm:w-28"
              ><img
                :src="line.product.image"
                :alt="line.product.name"
                class="h-full w-full object-contain p-2"
            /></RouterLink>
            <div class="min-w-0 flex-1 py-1">
              <div class="flex justify-between gap-3">
                <div class="min-w-0">
                  <p class="text-[12px] font-bold uppercase text-[#E8A020]">
                    {{ line.product.brand }}
                  </p>
                  <h2 class="mt-1 truncate text-sm font-semibold text-[var(--text)]">
                    {{ line.product.name }}
                  </h2>
                  <p class="mt-1 text-[12px] text-[var(--muted)]">
                    {{ line.product.volume }} · {{ line.product.viscosity }} ·
                    {{ line.product.merchantName }}
                  </p>
                </div>
                <button
                  aria-label="إزالة المنتج"
                  class="text-[var(--muted)] hover:text-[#E8A020]"
                  @click="cart.clear(line.product.id)"
                >
                  <Trash2 :size="16" />
                </button>
              </div>
              <div class="mt-4 flex items-center justify-between">
                <div class="flex h-8 items-center rounded-lg border border-[var(--line)]">
                  <button
                    class="grid h-8 w-8 place-items-center text-[var(--muted)]"
                    aria-label="إنقاص الكمية"
                    @click="cart.remove(line.product.id)"
                  >
                    <Minus :size="13" /></button
                  ><span class="w-5 text-center text-xs font-bold">{{ line.quantity }}</span
                  ><button
                    class="grid h-8 w-8 place-items-center text-[var(--muted)]"
                    aria-label="زيادة الكمية"
                    @click="cart.add(line.product)"
                  >
                    <Plus :size="13" />
                  </button>
                </div>
                <strong class="text-sm text-[var(--text)]">{{
                  formatPrice(line.product.price * line.quantity)
                }}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
      <aside class="h-fit rounded-[24px] border border-[var(--line)] bg-[var(--panel)] p-5 sm:p-7">
        <h2 class="display-font text-xl font-bold text-[var(--text)]">ملخص الطلب</h2>
        <div class="mt-6 space-y-3 border-b border-[var(--line)] pb-5 text-xs">
          <div class="flex justify-between text-[var(--muted)]">
            <span>المجموع الفرعي</span
            ><span class="text-[var(--text)]">{{ formatPrice(cart.subtotal) }}</span>
          </div>
          <div class="flex justify-between text-[var(--muted)]">
            <span>التوصيل</span><span class="text-[#E8A020]">يحددها التاجر</span>
          </div>
        </div>
        <div class="mt-5 flex justify-between">
          <span class="text-sm font-semibold text-[var(--text)]">الإجمالي</span
          ><strong class="display-font text-2xl text-[var(--text)]">{{
            formatPrice(cart.subtotal)
          }}</strong>
        </div>
        <RouterLink
          to="/checkout"
          class="mt-6 flex h-12 items-center justify-center gap-2 rounded-xl bg-[#E8A020] text-sm font-bold text-[#071F0D] hover:bg-[#F5C060]"
          >إتمام الطلب <ArrowLeft :size="16"
        /></RouterLink>
        <p class="mt-4 text-center text-[12px] text-[var(--muted)]">الدفع عند الاستلام</p>
      </aside>
    </div>
    <div v-else class="flex min-h-[65vh] items-center justify-center py-16">
      <div class="text-center">
        <div
          class="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#E8A020]/10 text-[#E8A020]"
        >
          <ShoppingBag :size="28" />
        </div>
        <h1 class="display-font mt-7 text-3xl font-bold text-[var(--text)]">سلتك فارغة.</h1>
        <p class="mt-3 text-sm text-[var(--muted)]">أضف شيئاً يناسب محركك وبيظهر هون.</p>
        <RouterLink
          to="/products"
          class="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#E8A020] px-5 py-3 text-xs font-bold text-[#071F0D]"
          >تصفّح المتجر <ArrowRight :size="15"
        /></RouterLink>
      </div>
    </div>
  </div>
</template>

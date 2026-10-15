<script setup lang="ts">
import { formatPrice } from '@/lib/utils'
import { computed, ref } from 'vue'
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Heart,
  Minus,
  Plus,
  ShieldCheck,
  Star,
  Truck,
} from 'lucide-vue-next'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { products } from '@/data/products'
import { useCartStore } from '@/stores/cart'
import { useVehicleStore } from '@/stores/vehicle'
import { useWishlistStore } from '@/stores/wishlist'
import ErrorPage from '@/pages/ErrorPage.vue'

const route = useRoute()
const router = useRouter()
const cart = useCartStore()
const vehicleStore = useVehicleStore()
const wishlist = useWishlistStore()
const product = computed(() =>
  products.find((candidate) => candidate.slug === String(route.params.slug)),
)
const selectedImage = ref(0)
const quantity = ref(1)
const added = ref(false)
const saved = computed(() => (product.value ? wishlist.has(product.value.id) : false))
const compatible = computed(() =>
  product.value && vehicleStore.vehicle
    ? product.value.compatibleMakes.includes(vehicleStore.vehicle.make)
    : null,
)

function addToCart() {
  if (!product.value) return
  for (let index = 0; index < quantity.value; index += 1) cart.add(product.value)
  added.value = true
}
function toggleSaved() {
  if (product.value) wishlist.toggle(product.value.id)
}
</script>

<template>
  <div class="pb-12 pt-8 sm:pt-12">
    <RouterLink
      to="/catalog"
      class="inline-flex items-center gap-2 text-xs font-semibold text-[#8E96A3] transition hover:text-white"
      ><ArrowLeft :size="15" /> Back to shop</RouterLink
    >

    <div v-if="product" class="mt-7 grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
      <div>
        <div
          class="relative aspect-square overflow-hidden rounded-[28px] border border-white/10 bg-[#181c22]"
        >
          <img
            :src="product.images[selectedImage]"
            :alt="product.name"
            class="h-full w-full object-cover opacity-75 mix-blend-screen"
          />
          <div
            class="absolute inset-0 bg-gradient-to-t from-[#101318] via-transparent to-transparent"
          ></div>
          <span
            class="absolute left-5 top-5 rounded-full bg-[#F5A710] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#0B0D10]"
            >{{ product.brand }}</span
          >
          <span
            class="absolute bottom-5 left-5 rounded-lg bg-white/10 px-3 py-2 text-sm font-bold backdrop-blur"
            >{{ product.viscosity }} · {{ product.volume }}</span
          >
        </div>
        <div class="mt-3 grid grid-cols-2 gap-3">
          <button
            v-for="(image, index) in product.images"
            :key="image"
            class="aspect-[1.5] overflow-hidden rounded-xl border-2 bg-[#181c22]"
            :class="selectedImage === index ? 'border-[#F5A710]' : 'border-transparent opacity-60'"
            :aria-pressed="selectedImage === index"
            @click="selectedImage = index"
          >
            <img
              :src="image"
              :alt="`${product.name} view ${index + 1}`"
              class="h-full w-full object-cover mix-blend-screen"
            />
          </button>
        </div>
      </div>

      <div class="flex flex-col justify-center">
        <div class="flex items-center gap-2 text-xs text-[#F5A710]">
          <Star :size="15" fill="currentColor" stroke="none" /><strong>{{ product.rating }}</strong
          ><span class="text-[#8E96A3]">({{ product.reviewCount }} reviews)</span>
        </div>
        <h1
          class="display-font mt-4 max-w-xl text-4xl font-bold leading-[0.98] tracking-[-0.06em] text-white sm:text-6xl"
        >
          {{ product.name }}<span class="text-[#F5A710]">.</span>
        </h1>
        <p class="mt-5 max-w-lg text-sm leading-relaxed text-[#8E96A3]">
          {{ product.description }}
        </p>
        <div class="mt-7 flex items-end gap-3">
          <span class="display-font text-4xl font-bold tracking-tight text-white">{{
            formatPrice(product.price)
          }}</span
          ><span v-if="product.originalPrice" class="pb-1 text-sm text-[#68707D] line-through">{{
            formatPrice(product.originalPrice)
          }}</span
          ><span
            class="mb-1 rounded-full bg-[#58D5E6]/10 px-2 py-1 text-[10px] font-bold text-[#58D5E6]"
            >In stock · {{ product.stock }} left</span
          >
        </div>
        <div class="mt-8 rounded-2xl border border-white/[0.08] bg-[#14171C] p-4">
          <div class="flex items-center gap-3">
            <span class="grid h-9 w-9 place-items-center rounded-lg bg-[#58D5E6]/10 text-[#58D5E6]"
              ><Truck :size="18"
            /></span>
            <div>
              <p class="text-xs font-semibold text-white">Free delivery</p>
              <p class="mt-1 text-[11px] text-[#8E96A3]">Arrives tomorrow if ordered by 2 PM</p>
            </div>
          </div>
        </div>
        <div class="mt-5 flex gap-3">
          <div class="flex h-12 items-center rounded-xl border border-white/10 bg-[#14171C]">
            <button
              class="grid h-12 w-10 place-items-center text-[#8E96A3] hover:text-white"
              aria-label="Decrease quantity"
              @click="quantity = Math.max(1, quantity - 1)"
            >
              <Minus :size="15" /></button
            ><span class="w-6 text-center text-sm font-bold">{{ quantity }}</span
            ><button
              class="grid h-12 w-10 place-items-center text-[#8E96A3] hover:text-white"
              aria-label="Increase quantity"
              @click="quantity = Math.min(product.stock, quantity + 1)"
            >
              <Plus :size="15" />
            </button>
          </div>
          <button
            class="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#F5A710] text-sm font-bold text-[#0B0D10] transition hover:bg-[#FFC233] active:scale-[0.99]"
            @click="addToCart"
          >
            <Check v-if="added" :size="17" stroke-width="3" /><span>{{
              added ? 'Added to your bag' : 'Add to bag'
            }}</span></button
          ><button
            aria-label="Save product"
            :aria-pressed="saved"
            class="grid h-12 w-12 place-items-center rounded-xl border border-white/10 bg-[#14171C] text-[#8E96A3] hover:text-white"
            @click="toggleSaved"
          >
            <Heart :size="18" :fill="saved ? 'currentColor' : 'none'" />
          </button>
        </div>
        <RouterLink
          v-if="!vehicleStore.vehicle"
          to="/garage/add"
          class="mt-5 flex items-center gap-2 text-xs font-semibold text-[#58D5E6]"
          ><ShieldCheck :size="16" /> Is this compatible with your car? <ChevronRight :size="14"
        /></RouterLink>
        <p
          v-else
          class="mt-5 flex items-center gap-2 text-xs font-semibold"
          :class="compatible ? 'text-[#58D5E6]' : 'text-[#F5A710]'"
        >
          <Check :size="16" />
          {{
            compatible
              ? `Fits your ${vehicleStore.vehicle.make} ${vehicleStore.vehicle.model}`
              : `Check fitment for your ${vehicleStore.vehicle.make}`
          }}
        </p>
      </div>
    </div>

    <div v-if="product" class="mt-14 grid gap-4 border-t border-white/[0.07] pt-10 lg:grid-cols-2">
      <details open class="group rounded-2xl border border-white/[0.08] bg-[#14171C] p-5">
        <summary
          class="flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-white"
        >
          Performance specs <ChevronRight :size="16" class="transition group-open:rotate-90" />
        </summary>
        <div class="mt-5 overflow-hidden rounded-xl border border-white/[0.07]">
          <div
            v-for="([label, value], index) in Object.entries(product.specs)"
            :key="label"
            class="flex justify-between gap-5 px-4 py-3 text-xs"
            :class="index % 2 ? 'bg-[#101318]' : 'bg-[#14171C]'"
          >
            <span class="text-[#8E96A3]">{{ label }}</span
            ><strong class="text-right text-white">{{ value }}</strong>
          </div>
        </div>
      </details>
      <details open class="group rounded-2xl border border-white/[0.08] bg-[#14171C] p-5">
        <summary
          class="flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-white"
        >
          What drivers say <ChevronRight :size="16" class="transition group-open:rotate-90" />
        </summary>
        <div class="mt-5 space-y-5">
          <div
            v-for="review in product.reviews"
            :key="review.id"
            class="border-b border-white/[0.07] pb-5 last:border-0 last:pb-0"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs font-semibold text-white">
                  {{ review.author }}
                  <span v-if="review.verified" class="ml-1 text-[10px] font-medium text-[#58D5E6]"
                    >Verified</span
                  >
                </p>
                <div class="mt-1 flex gap-0.5 text-[#F5A710]">
                  <Star
                    v-for="star in 5"
                    :key="star"
                    :size="11"
                    :fill="star <= review.rating ? 'currentColor' : 'none'"
                  />
                </div>
              </div>
              <time class="text-[10px] text-[#68707D]">{{ review.date }}</time>
            </div>
            <p class="mt-3 text-xs leading-relaxed text-[#A8AFBA]">{{ review.body }}</p>
          </div>
        </div>
      </details>
    </div>

    <ErrorPage v-else kind="not-found" @home="router.push('/')" />
  </div>
</template>

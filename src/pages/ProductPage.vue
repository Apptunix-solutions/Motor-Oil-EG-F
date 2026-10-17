<script setup lang="ts">
import { formatPrice } from '@/lib/utils'
import { computed, ref } from 'vue'
import {
  ArrowRight,
  Check,
  ChevronLeft,
  Heart,
  Minus,
  Phone,
  Plus,
  RotateCcw,
  ShieldCheck,
  Star,
  Store,
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

/**
 * حلّ متسامح لمعايرة المنتج من الرابط:
 * يقبل الـ UUID (slug) بحالة أيّا كانت، أو معرّف المنتج، أو اسم المنتج بالعربية
 * أو بالإنجليزية. هكذا تعمل روابط URL المُشارَك بها مهما كانت صيغتها (ar/en)
 * أو ترميزها، مع تجاهل المسافات/الشرطات الزائدة.
 */
const normalise = (value: unknown): string =>
  String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')

/** فكّ ترميز آمن: vue-router يفكّ الترميز أصلاً، نحمي أنفسنا من نصوص تالفة. */
function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

const product = computed(() => {
  const raw = String(route.params.slug ?? '')
  const key = normalise(safeDecode(raw))
  if (!key) return undefined
  return (
    products.find((candidate) => normalise(candidate.slug) === key) ??
    products.find((candidate) => normalise(candidate.id) === key) ??
    products.find((candidate) => normalise(candidate.name) === key) ??
    // مطابقة الأسماء متعددة الكلمات بالترتيب الجزئي (عشاء الاسم في الرابط)
    products.find((candidate) => {
      const name = normalise(candidate.name)
      return name.includes(key) || key.includes(name)
    })
  )
})
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
    <nav
      aria-label="مسار التنقل"
      class="flex flex-wrap items-center gap-2 text-xs text-[var(--muted)]"
    >
      <RouterLink to="/" class="transition hover:text-[var(--text)]">الرئيسية</RouterLink>
      <ChevronLeft :size="13" class="rtl:rotate-0 ltr:rotate-180" />
      <RouterLink to="/products" class="transition hover:text-[var(--text)]">المنتجات</RouterLink>
      <template v-if="product">
        <ChevronLeft :size="13" class="rtl:rotate-0 ltr:rotate-180" />
        <span class="text-[#E8A020]">{{ product.name }}</span>
      </template>
    </nav>

    <div v-if="product" class="mt-7 grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
      <div>
        <div
          class="relative aspect-square overflow-hidden rounded-[28px] border border-[var(--line)] bg-[var(--elevated)]"
        >
          <img
            :src="product.images[selectedImage]"
            :alt="product.name"
            class="h-full w-full object-cover transition-transform duration-500 ease-out hover:scale-105"
          />
          <div
            class="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 via-transparent to-transparent"
          ></div>
          <span
            class="absolute start-5 top-5 rounded-full bg-[#E8A020] px-3.5 py-1.5 text-[12px] font-bold text-[#071F0D] shadow-md"
            >{{ product.brand }}</span
          >
          <span
            class="absolute bottom-5 start-5 rounded-lg bg-[var(--glass-strong)] px-3 py-2 text-sm font-bold backdrop-blur border border-white/10 text-[var(--text)] shadow-md"
            >{{ product.viscosity }} · {{ product.volume }}</span
          >
        </div>
        <div class="mt-3 grid grid-cols-2 gap-3">
          <button
            v-for="(image, index) in product.images"
            :key="image"
            class="aspect-[1.5] overflow-hidden rounded-xl border-2 bg-[var(--elevated)] transition"
            :class="
              selectedImage === index
                ? 'border-[#E8A020] shadow-md shadow-[#E8A020]/15'
                : 'border-[var(--line)] opacity-60 hover:opacity-100'
            "
            :aria-pressed="selectedImage === index"
            :aria-label="`صورة ${index + 1}`"
            @click="selectedImage = index"
          >
            <img
              :src="image"
              :alt="`${product.name} صورة ${index + 1}`"
              class="h-full w-full object-cover"
            />
          </button>
        </div>
      </div>

      <div class="flex flex-col justify-center">
        <div class="flex items-center gap-2 text-xs text-[#E8A020]">
          <Star :size="15" fill="currentColor" stroke="none" /><strong>{{ product.rating }}</strong
          ><span class="text-[var(--muted)]">({{ product.reviewCount }} تقييم)</span>
        </div>
        <h1
          class="display-font mt-4 max-w-xl text-3xl font-bold leading-[1.1] text-[var(--text)] sm:text-5xl"
        >
          {{ product.name }}
        </h1>
        <RouterLink
          :to="`/merchants/${product.merchantId}`"
          class="mt-3 inline-flex w-fit items-center gap-2 rounded-lg border border-[var(--line)] bg-[var(--panel)] px-3 py-2 text-xs font-semibold text-[var(--soft)] transition hover:border-[#E8A020]/50 hover:text-[var(--text)]"
          ><Store :size="14" class="text-[#E8A020]" /> {{ product.merchantName }}</RouterLink
        >
        <p class="mt-5 max-w-lg text-sm leading-loose text-[var(--muted)]">
          {{ product.description }}
        </p>
        <div class="mt-7 flex flex-wrap items-end gap-3">
          <span class="display-font text-4xl font-bold tracking-tight text-[var(--text)]">{{
            formatPrice(product.price)
          }}</span
          ><span
            v-if="product.originalPrice"
            class="pb-1 text-sm text-[var(--muted)] line-through"
            >{{ formatPrice(product.originalPrice) }}</span
          ><span
            class="mb-1 rounded-full px-2 py-1 text-[12px] font-bold"
            :class="
              product.stock > 0 ? 'bg-[#E8A020]/10 text-[#E8A020]' : 'bg-red-500/10 text-red-300'
            "
            >{{ product.stock > 0 ? `متوفر · ${product.stock} قطعة` : 'نفذ المخزون' }}</span
          >
        </div>

        <div class="mt-6 grid gap-3 sm:grid-cols-3">
          <div
            class="flex items-center gap-2 rounded-xl border border-[var(--line)] bg-[var(--panel)] px-3 py-3"
          >
            <Truck :size="17" class="shrink-0 text-[#E8A020]" />
            <p class="text-[12px] font-semibold text-[var(--text)]">توصيل سريع</p>
          </div>
          <div
            class="flex items-center gap-2 rounded-xl border border-[var(--line)] bg-[var(--panel)] px-3 py-3"
          >
            <ShieldCheck :size="17" class="shrink-0 text-[#E8A020]" />
            <p class="text-[12px] font-semibold text-[var(--text)]">منتج أصلي 100%</p>
          </div>
          <div
            class="flex items-center gap-2 rounded-xl border border-[var(--line)] bg-[var(--panel)] px-3 py-3"
          >
            <RotateCcw :size="17" class="shrink-0 text-[#E8A020]" />
            <p class="text-[12px] font-semibold text-[var(--text)]">إرجاع حسب سياسة التاجر</p>
          </div>
        </div>

        <div class="mt-5 flex gap-3">
          <div
            class="flex h-12 items-center rounded-xl border border-[var(--line)] bg-[var(--panel)]"
          >
            <button
              class="grid h-12 w-10 place-items-center text-[var(--muted)] hover:text-[var(--text)]"
              aria-label="إنقاص الكمية"
              @click="quantity = Math.max(1, quantity - 1)"
            >
              <Minus :size="15" /></button
            ><span class="w-6 text-center text-sm font-bold">{{ quantity }}</span
            ><button
              class="grid h-12 w-10 place-items-center text-[var(--muted)] hover:text-[var(--text)]"
              aria-label="زيادة الكمية"
              :disabled="quantity >= product.stock"
              @click="quantity = Math.min(product.stock, quantity + 1)"
            >
              <Plus :size="15" />
            </button>
          </div>
          <button
            :disabled="product.stock === 0"
            class="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#E8A020] text-sm font-bold text-[#071F0D] transition hover:bg-[#F5C060] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
            @click="addToCart"
          >
            <Check v-if="added" :size="17" stroke-width="3" /><span>{{
              product.stock === 0 ? 'نفذ المخزون' : added ? 'أُضيف إلى السلة' : 'أضف إلى السلة'
            }}</span></button
          ><button
            aria-label="حفظ المنتج"
            :aria-pressed="saved"
            class="grid h-12 w-12 place-items-center rounded-xl border border-[var(--line)] bg-[var(--panel)] text-[var(--muted)] hover:text-[var(--text)]"
            @click="toggleSaved"
          >
            <Heart :size="18" :fill="saved ? 'currentColor' : 'none'" />
          </button>
        </div>

        <RouterLink
          v-if="product.merchantId"
          :to="`/merchants/${product.merchantId}`"
          class="mt-5 flex items-center gap-2 text-xs font-semibold text-[var(--muted)] hover:text-[#E8A020]"
        >
          <Phone :size="15" class="text-[#E8A020]" /> تواصل مع {{ product.merchantName }}
          <ChevronLeft :size="14" />
        </RouterLink>
        <p
          v-if="vehicleStore.vehicle"
          class="mt-4 flex items-center gap-2 text-xs font-semibold"
          :class="compatible ? 'text-[#E8A020]' : 'text-[var(--muted)]'"
        >
          <Check :size="16" />
          {{
            compatible
              ? `مناسب لسيارتك ${vehicleStore.vehicle.make} ${vehicleStore.vehicle.model}`
              : `تحقق من التوافق لسيارتك ${vehicleStore.vehicle.make}`
          }}
        </p>
        <RouterLink
          v-else
          to="/garage/add"
          class="mt-4 flex items-center gap-2 text-xs font-semibold text-[#E8A020]"
          ><ShieldCheck :size="16" /> أضف سيارتك لمعرفة التوافق <ChevronLeft :size="14"
        /></RouterLink>
      </div>
    </div>

    <div v-if="product" class="mt-14 grid gap-4 border-t border-[var(--line)] pt-10 lg:grid-cols-2">
      <details open class="group rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-5">
        <summary
          class="flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-[var(--text)]"
        >
          المواصفات <ChevronLeft :size="16" class="transition group-open:-rotate-90" />
        </summary>
        <div class="mt-5 overflow-hidden rounded-xl border border-[var(--line)]">
          <div
            v-for="([label, value], index) in Object.entries(product.specs)"
            :key="label"
            class="flex justify-between gap-5 px-4 py-3 text-xs"
            :class="index % 2 ? 'bg-[var(--bg)]' : 'bg-[var(--panel)]'"
          >
            <span class="text-[var(--muted)]">{{ label }}</span
            ><strong class="text-left text-[var(--text)]">{{ value }}</strong>
          </div>
        </div>
      </details>
      <details open class="group rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-5">
        <summary
          class="flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-[var(--text)]"
        >
          التقييمات ({{ product.reviewCount }})
          <ChevronLeft :size="16" class="transition group-open:-rotate-90" />
        </summary>
        <div v-if="product.reviews.length" class="mt-5 space-y-5">
          <div
            v-for="review in product.reviews"
            :key="review.id"
            class="border-b border-[var(--line)] pb-5 last:border-0 last:pb-0"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs font-semibold text-[var(--text)]">
                  {{ review.author }}
                  <span v-if="review.verified" class="mr-1 text-[12px] font-medium text-[#E8A020]"
                    >موثّق</span
                  >
                </p>
                <div class="mt-1 flex gap-0.5 text-[#E8A020]">
                  <Star
                    v-for="star in 5"
                    :key="star"
                    :size="11"
                    :fill="star <= review.rating ? 'currentColor' : 'none'"
                  />
                </div>
              </div>
              <time class="text-[12px] text-[var(--muted)]">{{ review.date }}</time>
            </div>
            <p class="mt-3 text-xs leading-relaxed text-[var(--soft)]">{{ review.body }}</p>
          </div>
        </div>
        <p v-else class="mt-5 text-sm text-[var(--muted)]">لا توجد تقييمات بعد.</p>
      </details>

      <div class="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-5 lg:col-span-2">
        <p class="text-sm font-semibold text-[var(--text)]">
          منتجات أخرى من {{ product.merchantName }}
        </p>
        <div class="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <RouterLink
            v-for="related in products
              .filter(
                (entry) => entry.merchantId === product?.merchantId && entry.id !== product?.id,
              )
              .slice(0, 4)"
            :key="related.id"
            :to="`/product/${related.slug}`"
            class="group flex items-center gap-3 rounded-xl border border-[var(--line)] bg-[var(--bg)] p-3 transition hover:border-[#E8A020]/40 hover:bg-[var(--elevated)]"
          >
            <div
              class="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--elevated)] p-1 flex items-center justify-center shadow-sm"
            >
              <img
                :src="related.image"
                :alt="related.name"
                loading="lazy"
                class="h-full w-full rounded-lg object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <span class="min-w-0 flex-1">
              <span
                class="block truncate text-[12px] font-semibold text-[var(--text)] transition-colors group-hover:text-[#E8A020]"
                >{{ related.name }}</span
              >
              <span class="mt-1 block text-[12px] font-bold text-[#E8A020]">{{
                formatPrice(related.price)
              }}</span>
            </span>
            <ArrowRight
              :size="14"
              class="ms-auto shrink-0 text-[var(--muted)] transition-all group-hover:text-[#E8A020] rtl:rotate-180 rtl:group-hover:-translate-x-0.5 ltr:rotate-0 ltr:group-hover:translate-x-0.5"
            />
          </RouterLink>
        </div>
      </div>
    </div>

    <ErrorPage v-else kind="not-found" @home="router.push('/')" />
  </div>
</template>

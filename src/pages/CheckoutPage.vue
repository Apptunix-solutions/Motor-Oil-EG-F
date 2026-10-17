<script setup lang="ts">
import { reactive, ref } from 'vue'
import { z } from 'zod'
import { ArrowRight, Banknote, Check, Info, MapPin, ShoppingBag } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'
import { checkoutSchema, type CheckoutField, type CheckoutForm } from '@/lib/validators'
import { formatPrice } from '@/lib/utils'
import { reportError } from '@/lib/errors'
import { useCartStore } from '@/stores/cart'
import { useOrdersStore } from '@/stores/orders'

const cart = useCartStore()
const orders = useOrdersStore()
const submitted = ref(false)
const submitting = ref(false)
const orderId = ref('')
const confirmedEmail = ref('')
const formError = ref('')
const fieldErrors = reactive<Partial<Record<CheckoutField, string>>>({})
const form = reactive<CheckoutForm>({
  email: '',
  phone: '',
  name: '',
  street: '',
  city: '',
  postalCode: '',
})

const governorates = [
  'دمشق',
  'ريف دمشق',
  'حلب',
  'حمص',
  'حماة',
  'اللاذقية',
  'طرطوس',
  'إدلب',
  'الرقة',
  'الحسكة',
  'دير الزور',
  'درعا',
  'السويداء',
  'القنيطرة',
]

const fields: {
  key: CheckoutField
  label: string
  placeholder: string
  autocomplete: string
  type?: string
  inputmode?: 'text' | 'email' | 'tel' | 'numeric'
  wide?: boolean
}[] = [
  {
    key: 'email',
    label: 'البريد الإلكتروني',
    placeholder: 'you@email.com',
    autocomplete: 'email',
    type: 'email',
    inputmode: 'email',
  },
  {
    key: 'phone',
    label: 'رقم الهاتف',
    placeholder: '09XXXXXXXX',
    autocomplete: 'tel',
    type: 'tel',
    inputmode: 'tel',
  },
  {
    key: 'name',
    label: 'الاسم الكامل',
    placeholder: 'الاسم الكامل',
    autocomplete: 'name',
    wide: true,
  },
  {
    key: 'street',
    label: 'العنوان',
    placeholder: 'الحي، الشارع، رقم البناية',
    autocomplete: 'street-address',
    wide: true,
  },
  { key: 'city', label: 'المحافظة', placeholder: 'دمشق', autocomplete: 'address-level2' },
  {
    key: 'postalCode',
    label: 'الرمز البريدي',
    placeholder: '11511',
    autocomplete: 'postal-code',
    inputmode: 'numeric',
  },
]

function clearErrors() {
  for (const key of Object.keys(fieldErrors) as CheckoutField[]) delete fieldErrors[key]
  formError.value = ''
}

function placeOrder() {
  if (submitting.value) return
  clearErrors()

  if (!cart.lines.length) {
    formError.value = 'سلتك فارغة. أضف منتجاً قبل إتمام الطلب.'
    return
  }

  const result = checkoutSchema.safeParse(form)
  if (!result.success) {
    const errors = z.flattenError(result.error).fieldErrors
    for (const [key, messages] of Object.entries(errors)) {
      if (messages?.[0]) fieldErrors[key as CheckoutField] = messages[0]
    }
    formError.value = 'يرجى تصحيح الحقول المحددة.'
    const firstInvalid = fields.find((field) => fieldErrors[field.key])
    if (firstInvalid) document.getElementById(`checkout-${firstInvalid.key}`)?.focus()
    return
  }

  submitting.value = true
  try {
    const { name, street, city, postalCode, phone, email } = result.data
    const order = orders.create(
      cart.lines,
      { name, street, city, postalCode, phone },
      cart.subtotal,
    )
    orderId.value = order.id
    confirmedEmail.value = email
    cart.clearAll()
    submitted.value = true
  } catch (error) {
    reportError(error, 'checkout')
    formError.value = 'تعذّر إتمام الطلب. يرجى المحاولة مرة أخرى.'
  } finally {
    submitting.value = false
  }
}

function goToGovernorate() {
  const select = document.getElementById('checkout-city') as HTMLSelectElement | null
  if (select) select.focus()
}
</script>

<template>
  <div class="pb-12 pt-8 sm:pt-14">
    <RouterLink
      to="/cart"
      class="inline-flex items-center gap-2 text-xs font-semibold text-[var(--muted)] hover:text-[var(--text)]"
      ><ArrowRight :size="15" /> العودة إلى السلة</RouterLink
    >
    <div
      v-if="submitted"
      class="mx-auto flex min-h-[65vh] max-w-md items-center justify-center text-center"
      role="status"
    >
      <div>
        <div
          class="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#E8A020]/10 text-[#E8A020]"
        >
          <Check :size="30" />
        </div>
        <p class="mt-7 text-[12px] font-bold uppercase text-[#E8A020]">تم استلام الطلب</p>
        <h1 class="display-font mt-2 text-4xl font-bold text-[var(--text)]">
          شكراً لطلبك<span class="text-[#E8A020]">.</span>
        </h1>
        <p class="mt-4 text-sm leading-relaxed text-[var(--muted)]">
          ستدفع نقداً عند وصول طلبك. تم حفظ تفاصيل الطلب لـ
          {{ confirmedEmail }} على هذا الجهاز.
        </p>
        <p class="mt-3 text-[12px] font-semibold text-[#E8A020]">الطلب {{ orderId }}</p>
        <RouterLink
          to="/"
          class="mt-7 inline-flex rounded-xl bg-[#E8A020] px-5 py-3 text-xs font-bold text-[#071F0D]"
          >العودة للرئيسية</RouterLink
        >
      </div>
    </div>
    <div
      v-else-if="!cart.lines.length"
      class="mx-auto flex min-h-[55vh] max-w-md flex-col items-center justify-center text-center"
    >
      <div
        class="grid h-16 w-16 place-items-center rounded-full bg-[var(--glass-strong)] text-[var(--muted)]"
      >
        <ShoppingBag :size="28" />
      </div>
      <h1 class="display-font mt-6 text-3xl font-bold text-[var(--text)]">
        سلتك فارغة<span class="text-[#E8A020]">.</span>
      </h1>
      <p class="mt-3 text-sm text-[var(--muted)]">أضف منتجاً قبل إتمام الطلب.</p>
      <RouterLink
        to="/products"
        class="mt-7 inline-flex rounded-xl bg-[#E8A020] px-5 py-3 text-xs font-bold text-[#071F0D]"
        >تصفّح المنتجات</RouterLink
      >
    </div>
    <div v-else class="mt-9 grid gap-8 lg:grid-cols-[1fr_360px]">
      <div>
        <p class="text-[12px] font-bold uppercase text-[#E8A020]">إتمام الطلب</p>
        <h1 class="display-font mt-2 text-4xl font-bold text-[var(--text)]">
          أكمل طلبك<span class="text-[#E8A020]">.</span>
        </h1>
        <form class="mt-8 space-y-5" novalidate @submit.prevent="placeOrder">
          <fieldset class="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-5 sm:p-7">
            <legend class="sr-only">بيانات التوصيل</legend>
            <div class="flex items-center gap-3" aria-hidden="true">
              <span
                class="grid h-8 w-8 place-items-center rounded-lg bg-[#E8A020]/10 text-[#E8A020]"
                ><MapPin :size="16"
              /></span>
              <h2 class="text-sm font-semibold text-[var(--text)]">بيانات التوصيل</h2>
            </div>
            <div class="mt-5 grid gap-4 sm:grid-cols-2">
              <div
                v-for="field in fields"
                :key="field.key"
                :class="{ 'sm:col-span-2': field.wide }"
              >
                <label
                  :for="`checkout-${field.key}`"
                  class="mb-2 block text-[12px] font-semibold text-[var(--soft)]"
                  >{{ field.label }}</label
                >
                <input
                  :id="`checkout-${field.key}`"
                  v-model="form[field.key]"
                  :name="field.key"
                  :type="field.type ?? 'text'"
                  :inputmode="field.inputmode"
                  :autocomplete="field.autocomplete"
                  :placeholder="field.placeholder"
                  :list="field.key === 'city' ? 'governorates' : undefined"
                  :aria-invalid="fieldErrors[field.key] ? 'true' : undefined"
                  :aria-describedby="
                    fieldErrors[field.key] ? `checkout-${field.key}-error` : undefined
                  "
                  required
                  class="h-[46px] w-full rounded-xl border bg-[var(--input)] px-3.5 text-[13px] text-[var(--text)] outline-none placeholder:text-[var(--muted)] focus:border-[#E8A020]"
                  :class="fieldErrors[field.key] ? 'border-red-400/60' : 'border-[var(--line)]'"
                />
                <p
                  v-if="fieldErrors[field.key]"
                  :id="`checkout-${field.key}-error`"
                  class="mt-1.5 text-[12px] text-red-300"
                >
                  {{ fieldErrors[field.key] }}
                </p>
              </div>
            </div>
            <datalist id="governorates">
              <option v-for="governorate in governorates" :key="governorate" :value="governorate" />
            </datalist>
          </fieldset>
          <div class="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-5 sm:p-7">
            <div class="flex items-center gap-3">
              <span
                class="grid h-8 w-8 place-items-center rounded-lg bg-[#E8A020]/10 text-[#E8A020]"
                ><Banknote :size="16"
              /></span>
              <h2 class="text-sm font-semibold text-[var(--text)]">طريقة الدفع</h2>
            </div>
            <p class="mt-4 text-sm text-[var(--text)]">الدفع عند الاستلام</p>
            <p class="mt-1 text-xs leading-relaxed text-[var(--muted)]">
              ادفع للموصّل نقداً عند وصول طلبك. لا نجمع أي بيانات بطاقات.
            </p>
          </div>
          <p
            class="flex items-start gap-2 rounded-xl border border-[var(--line)] bg-[var(--glass)] px-4 py-3 text-[12px] leading-relaxed text-[var(--muted)]"
          >
            <Info :size="14" class="mt-0.5 shrink-0" aria-hidden="true" />
            إتمام الطلب عبر ZaytStore يُحفظ على هذا الجهاز حالياً ويتم تأكيده مع التاجر.
          </p>
          <p
            v-if="formError"
            role="alert"
            class="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs text-red-300"
          >
            {{ formError }}
          </p>
          <button
            type="submit"
            :disabled="submitting"
            :aria-busy="submitting"
            class="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#E8A020] text-sm font-bold text-[#071F0D] hover:bg-[#F5C060] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {{ submitting ? 'جارٍ إتمام الطلب…' : 'تأكيد الطلب' }}
            <Check v-if="!submitting" :size="17" aria-hidden="true" />
          </button>
        </form>
        <button
          type="button"
          class="mt-3 text-[12px] text-[var(--muted)] hover:text-[#E8A020]"
          @click="goToGovernorate"
        >
          تحتاج مساعدة في تحديد المحافظة؟
        </button>
      </div>
      <aside class="h-fit rounded-[24px] border border-[var(--line)] bg-[var(--panel)] p-5 sm:p-7">
        <h2 class="display-font text-xl font-bold text-[var(--text)]">طلبك</h2>
        <div class="mt-5 space-y-4 border-b border-[var(--line)] pb-5">
          <div
            v-for="line in cart.lines"
            :key="line.product.id"
            class="flex justify-between gap-3 text-xs"
          >
            <span class="text-[var(--muted)]">{{ line.quantity }} × {{ line.product.name }}</span
            ><span class="shrink-0 text-[var(--text)]">{{
              formatPrice(line.product.price * line.quantity)
            }}</span>
          </div>
        </div>
        <div class="mt-5 flex justify-between">
          <span class="text-sm font-semibold text-[var(--text)]">الإجمالي</span
          ><strong class="display-font text-2xl text-[var(--text)]">{{
            formatPrice(cart.subtotal)
          }}</strong>
        </div>
      </aside>
    </div>
  </div>
</template>

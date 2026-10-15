<script setup lang="ts">
import { reactive, ref } from 'vue'
import { z } from 'zod'
import { ArrowLeft, Banknote, Check, Info, MapPin, ShoppingBag } from 'lucide-vue-next'
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
    label: 'Email',
    placeholder: 'you@email.com',
    autocomplete: 'email',
    type: 'email',
    inputmode: 'email',
  },
  {
    key: 'phone',
    label: 'Mobile number',
    placeholder: '010 1234 5678',
    autocomplete: 'tel',
    type: 'tel',
    inputmode: 'tel',
  },
  { key: 'name', label: 'Full name', placeholder: 'Full name', autocomplete: 'name', wide: true },
  {
    key: 'street',
    label: 'Street address',
    placeholder: '14 Grand Avenue',
    autocomplete: 'street-address',
    wide: true,
  },
  { key: 'city', label: 'City', placeholder: 'Cairo', autocomplete: 'address-level2' },
  {
    key: 'postalCode',
    label: 'Postal code',
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
    formError.value = 'Your bag is empty. Add a product before placing an order.'
    return
  }

  const result = checkoutSchema.safeParse(form)
  if (!result.success) {
    const errors = z.flattenError(result.error).fieldErrors
    for (const [key, messages] of Object.entries(errors)) {
      if (messages?.[0]) fieldErrors[key as CheckoutField] = messages[0]
    }
    formError.value = 'Please fix the highlighted fields.'
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
    formError.value = 'We could not place your order. Please try again.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="pb-12 pt-8 sm:pt-14">
    <RouterLink
      to="/cart"
      class="inline-flex items-center gap-2 text-xs font-semibold text-[#8E96A3] hover:text-white"
      ><ArrowLeft :size="15" /> Back to bag</RouterLink
    >
    <div
      v-if="submitted"
      class="mx-auto flex min-h-[65vh] max-w-md items-center justify-center text-center"
      role="status"
    >
      <div>
        <div
          class="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#58D5E6]/10 text-[#58D5E6]"
        >
          <Check :size="30" />
        </div>
        <p class="mt-7 text-[10px] font-bold uppercase tracking-[0.18em] text-[#58D5E6]">
          Order placed
        </p>
        <h1 class="display-font mt-2 text-4xl font-bold tracking-[-0.06em] text-white">
          Thanks for your order<span class="text-[#F5A710]">.</span>
        </h1>
        <p class="mt-4 text-sm leading-relaxed text-[#8E96A3]">
          You&apos;ll pay in cash when your order arrives. Order details for
          {{ confirmedEmail }} are saved on this device under your garage.
        </p>
        <p class="mt-3 text-[11px] font-semibold text-[#58D5E6]">Order {{ orderId }}</p>
        <RouterLink
          to="/"
          class="mt-7 inline-flex rounded-xl bg-[#F5A710] px-5 py-3 text-xs font-bold text-[#0B0D10]"
          >Back to discover</RouterLink
        >
      </div>
    </div>
    <div
      v-else-if="!cart.lines.length"
      class="mx-auto flex min-h-[55vh] max-w-md flex-col items-center justify-center text-center"
    >
      <div class="grid h-16 w-16 place-items-center rounded-full bg-white/[0.05] text-[#8E96A3]">
        <ShoppingBag :size="28" />
      </div>
      <h1 class="display-font mt-6 text-3xl font-bold tracking-[-0.05em] text-white">
        Your bag is empty<span class="text-[#F5A710]">.</span>
      </h1>
      <p class="mt-3 text-sm text-[#8E96A3]">Add a product before checking out.</p>
      <RouterLink
        to="/catalog"
        class="mt-7 inline-flex rounded-xl bg-[#F5A710] px-5 py-3 text-xs font-bold text-[#0B0D10]"
        >Browse the catalog</RouterLink
      >
    </div>
    <div v-else class="mt-9 grid gap-8 lg:grid-cols-[1fr_360px]">
      <div>
        <p class="text-[10px] font-bold uppercase tracking-[0.18em] text-[#F5A710]">Checkout</p>
        <h1 class="display-font mt-2 text-4xl font-bold tracking-[-0.06em] text-white">
          Finish your order<span class="text-[#F5A710]">.</span>
        </h1>
        <form class="mt-8 space-y-5" novalidate @submit.prevent="placeOrder">
          <fieldset class="rounded-2xl border border-white/[0.08] bg-[#14171C] p-5 sm:p-7">
            <legend class="sr-only">Delivery details</legend>
            <div class="flex items-center gap-3" aria-hidden="true">
              <span
                class="grid h-8 w-8 place-items-center rounded-lg bg-[#F5A710]/10 text-[#F5A710]"
                ><MapPin :size="16"
              /></span>
              <h2 class="text-sm font-semibold text-white">Delivery details</h2>
            </div>
            <div class="mt-5 grid gap-4 sm:grid-cols-2">
              <div
                v-for="field in fields"
                :key="field.key"
                :class="{ 'sm:col-span-2': field.wide }"
              >
                <label
                  :for="`checkout-${field.key}`"
                  class="mb-2 block text-[11px] font-semibold text-[#a8afba]"
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
                  :aria-invalid="fieldErrors[field.key] ? 'true' : undefined"
                  :aria-describedby="
                    fieldErrors[field.key] ? `checkout-${field.key}-error` : undefined
                  "
                  required
                  class="h-[46px] w-full rounded-xl border bg-[#0f1216] px-3.5 text-[13px] text-white outline-none placeholder:text-[#68707d] focus:border-[#f5a710]"
                  :class="fieldErrors[field.key] ? 'border-red-400/60' : 'border-white/10'"
                />
                <p
                  v-if="fieldErrors[field.key]"
                  :id="`checkout-${field.key}-error`"
                  class="mt-1.5 text-[11px] text-red-300"
                >
                  {{ fieldErrors[field.key] }}
                </p>
              </div>
            </div>
          </fieldset>
          <div class="rounded-2xl border border-white/[0.08] bg-[#14171C] p-5 sm:p-7">
            <div class="flex items-center gap-3">
              <span
                class="grid h-8 w-8 place-items-center rounded-lg bg-[#F5A710]/10 text-[#F5A710]"
                ><Banknote :size="16"
              /></span>
              <h2 class="text-sm font-semibold text-white">Payment method</h2>
            </div>
            <p class="mt-4 text-sm text-white">Cash on delivery</p>
            <p class="mt-1 text-xs leading-relaxed text-[#8E96A3]">
              Pay the courier in cash when your order arrives. No card details are collected.
            </p>
          </div>
          <p
            class="flex items-start gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-[11px] leading-relaxed text-[#8E96A3]"
          >
            <Info :size="14" class="mt-0.5 shrink-0" aria-hidden="true" />
            Online ordering is in preview: orders are saved on this device only and are not yet sent
            to our team.
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
            class="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#F5A710] text-sm font-bold text-[#0B0D10] hover:bg-[#FFC233] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {{ submitting ? 'Placing order…' : 'Place order' }}
            <Check v-if="!submitting" :size="17" aria-hidden="true" />
          </button>
        </form>
      </div>
      <aside class="h-fit rounded-[24px] border border-white/[0.08] bg-[#14171C] p-5 sm:p-7">
        <h2 class="display-font text-xl font-bold text-white">Your order</h2>
        <div class="mt-5 space-y-4 border-b border-white/[0.08] pb-5">
          <div
            v-for="line in cart.lines"
            :key="line.product.id"
            class="flex justify-between gap-3 text-xs"
          >
            <span class="text-[#8E96A3]">{{ line.quantity }} × {{ line.product.name }}</span
            ><span class="shrink-0 text-white">{{
              formatPrice(line.product.price * line.quantity)
            }}</span>
          </div>
        </div>
        <div class="mt-5 flex justify-between">
          <span class="text-sm font-semibold text-white">Total</span
          ><strong class="display-font text-2xl text-white">{{
            formatPrice(cart.subtotal)
          }}</strong>
        </div>
      </aside>
    </div>
  </div>
</template>

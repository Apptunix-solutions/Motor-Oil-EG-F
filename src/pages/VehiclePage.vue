<script setup lang="ts">
import { computed, ref } from 'vue'
import { ArrowRight, CarFront, Check } from 'lucide-vue-next'
import { RouterLink, useRouter } from 'vue-router'
import { UiSelect } from '@/components/ui'
import { useUserStore } from '@/stores/user'
import { useVehicleStore } from '@/stores/vehicle'

const router = useRouter()
const vehicleStore = useVehicleStore()
const userStore = useUserStore()
const make = ref(vehicleStore.vehicle?.make ?? '')
const model = ref(vehicleStore.vehicle?.model ?? '')
const year = ref(String(vehicleStore.vehicle?.year ?? ''))
const engine = ref(vehicleStore.vehicle?.engine ?? '')
const makes = ['Toyota', 'Kia', 'Hyundai', 'Nissan', 'Chevrolet', 'Ford', 'Renault', 'Peugeot']

const modelsByMake: Record<string, string[]> = {
  Toyota: ['Corolla', 'Camry', 'Land Cruiser', 'RAV4'],
  Kia: ['Rio', 'Sportage', 'Cerato', 'Pegas'],
  Hyundai: ['Elantra', 'Tucson', 'Accent', 'Santa Fe'],
  Nissan: ['Sunny', 'X-Trail', 'Patrol', 'Altima'],
  Chevrolet: ['Aveo', 'Captiva', 'Malibu', 'Tahoe'],
  Ford: ['Focus', 'Fiesta', 'Ranger', 'Explorer'],
  Renault: ['Symbol', 'Megane', 'Duster', 'Clio'],
  Peugeot: ['301', '208', '308', '3008'],
}

const models = computed(() => (make.value ? (modelsByMake[make.value] ?? []) : []))
const years = ['2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018']
const engines = ['1.5L Turbo', '2.0L Turbo', '2.5L Hybrid', '3.0L V6', '1.6L', '1.4L']
const canSave = computed(() => Boolean(make.value && model.value && year.value && engine.value))
function saveVehicle() {
  if (!canSave.value) return
  const next = {
    make: make.value,
    model: model.value,
    year: Number(year.value),
    engine: engine.value,
  }
  vehicleStore.select(next)
  userStore.update({ vehicle: next })
  router.push('/garage')
}
</script>

<template>
  <div class="mx-auto max-w-2xl pb-12 pt-8 sm:pt-14">
    <RouterLink
      to="/garage"
      class="inline-flex items-center gap-2 text-xs font-semibold text-[var(--muted)] hover:text-[var(--text)]"
      ><ArrowRight :size="15" /> العودة إلى حسابك</RouterLink
    >
    <div class="mt-12 text-center">
      <div
        class="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#E8A020]/10 text-[#E8A020]"
      >
        <CarFront :size="30" />
      </div>
      <p class="mt-7 text-[12px] font-bold uppercase text-[#E8A020]">سيارتك</p>
      <h1 class="display-font mt-2 text-4xl font-bold text-[var(--text)] sm:text-5xl">
        قلنا عن سيارتك<span class="text-[#E8A020]">.</span>
      </h1>
      <p class="mx-auto mt-4 max-w-md text-sm leading-relaxed text-[var(--muted)]">
        بنطابق كل زيت ومصفاة مع محرك سيارتك بالضبط. معلومات سيارتك محفوظة مع حسابك.
      </p>
    </div>
    <div class="mt-10 rounded-[26px] border border-[var(--line)] bg-[var(--panel)] p-5 sm:p-8">
      <div class="grid gap-5 sm:grid-cols-2">
        <label class="block"
          ><span class="mb-2 block text-[12px] font-semibold text-[var(--soft)]">الماركة</span
          ><UiSelect
            v-model="make"
            :options="makes"
            placeholder="اختر الماركة"
            class="h-12 w-full rounded-xl border border-[var(--line)] bg-[var(--input)] px-4 text-sm text-[var(--text)] outline-none transition focus:border-[#E8A020] focus:ring-1 focus:ring-[#E8A020]/50" /></label
        ><label class="block"
          ><span class="mb-2 block text-[12px] font-semibold text-[var(--soft)]">الموديل</span
          ><UiSelect
            v-model="model"
            :disabled="!make"
            :options="models"
            placeholder="اختر الموديل"
            class="h-12 w-full rounded-xl border border-[var(--line)] bg-[var(--input)] px-4 text-sm text-[var(--text)] outline-none transition focus:border-[#E8A020] focus:ring-1 focus:ring-[#E8A020]/50 disabled:opacity-40" /></label
        ><label class="block"
          ><span class="mb-2 block text-[12px] font-semibold text-[var(--soft)]">سنة الصنع</span
          ><UiSelect
            v-model="year"
            :options="years"
            placeholder="اختر السنة"
            class="h-12 w-full rounded-xl border border-[var(--line)] bg-[var(--input)] px-4 text-sm text-[var(--text)] outline-none transition focus:border-[#E8A020] focus:ring-1 focus:ring-[#E8A020]/50" /></label
        ><label class="block"
          ><span class="mb-2 block text-[12px] font-semibold text-[var(--soft)]">المحرك</span
          ><UiSelect
            v-model="engine"
            :options="engines"
            placeholder="اختر المحرك"
            class="h-12 w-full rounded-xl border border-[var(--line)] bg-[var(--input)] px-4 text-sm text-[var(--text)] outline-none transition focus:border-[#E8A020] focus:ring-1 focus:ring-[#E8A020]/50"
        /></label>
      </div>
      <button
        :disabled="!canSave"
        class="mt-7 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#E8A020] text-sm font-bold text-[#071F0D] transition hover:bg-[#F5C060] disabled:cursor-not-allowed disabled:opacity-40"
        @click="saveVehicle"
      >
        حفظ سيارتي <Check :size="17" />
      </button>
    </div>
    <div class="mt-5 flex items-center justify-center gap-2 text-[12px] text-[var(--muted)]">
      <Check :size="14" class="text-[#E8A020]" /> خاص افتراضياً · يمكنك تغييره في أي وقت
    </div>
  </div>
</template>

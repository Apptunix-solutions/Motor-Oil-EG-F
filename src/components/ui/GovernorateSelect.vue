<script setup lang="ts">
import { computed } from 'vue'
import {
  SelectContent,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectPortal,
  SelectRoot,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from 'reka-ui'
import { Check, ChevronDown, ChevronUp, MapPin } from 'lucide-vue-next'
import { syrianGovernorates } from '@/data/governorates'
import { useLocaleStore } from '@/stores/locale'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    placeholder?: string
    hasError?: boolean
    id?: string
    name?: string
    disabled?: boolean
  }>(),
  {
    modelValue: '',
    placeholder: '',
    hasError: false,
    id: undefined,
    name: undefined,
    disabled: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const locale = useLocaleStore()

const displayPlaceholder = computed(() => {
  if (props.placeholder) return props.placeholder
  return locale.isArabic ? 'اختر المحافظة...' : 'Select Governorate...'
})
</script>

<template>
  <div class="relative w-full" :dir="locale.dir">
    <SelectRoot
      :model-value="modelValue"
      :disabled="disabled"
      @update:model-value="emit('update:modelValue', $event)"
    >
      <SelectTrigger
        :id="id"
        :name="name"
        class="group relative flex h-[46px] w-full items-center justify-between rounded-xl border bg-[var(--input)] ps-10 pe-3 text-[13px] text-[var(--text)] outline-none transition focus:border-[#E8A020] disabled:cursor-not-allowed disabled:opacity-50"
        :class="
          hasError
            ? 'border-red-400/60 ring-1 ring-red-400/20'
            : 'border-[var(--line)] hover:border-[#E8A020]/40'
        "
      >
        <!-- Start Icon: MapPin -->
        <span
          class="pointer-events-none absolute start-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)] transition group-hover:text-[#E8A020]"
          aria-hidden="true"
        >
          <MapPin :size="15" />
        </span>

        <!-- Selected Value or Placeholder -->
        <SelectValue :placeholder="displayPlaceholder" class="truncate text-start" />

        <!-- End Icon: Chevron -->
        <ChevronDown
          class="h-4 w-4 shrink-0 text-[var(--muted)] transition-transform duration-200 group-hover:text-[var(--text)] data-[state=open]:rotate-180"
          aria-hidden="true"
        />
      </SelectTrigger>

      <SelectPortal>
        <SelectContent
          class="z-50 max-h-72 min-w-[12rem] overflow-hidden rounded-2xl border border-[var(--line-strong)] bg-[var(--panel)] p-1 text-[var(--text)] shadow-[0_16px_40px_rgba(0,0,0,0.4)] backdrop-blur-2xl"
          position="popper"
          :side-offset="6"
          :dir="locale.dir"
        >
          <SelectScrollUpButton
            class="flex cursor-default items-center justify-center py-1 text-[var(--muted)]"
          >
            <ChevronUp class="h-4 w-4" />
          </SelectScrollUpButton>

          <SelectViewport class="p-1 space-y-0.5">
            <SelectItem
              v-for="gov in syrianGovernorates"
              :key="gov.id"
              :value="gov.nameAr"
              class="relative flex cursor-pointer select-none items-center justify-between rounded-xl py-2 ps-3 pe-8 text-[12px] font-semibold text-[var(--text)] outline-none transition hover:bg-[#E8A020]/15 hover:text-[#E8A020] data-[state=checked]:bg-[#E8A020]/15 data-[state=checked]:text-[#E8A020] data-[disabled]:pointer-events-none data-[disabled]:opacity-40"
            >
              <div class="flex items-center gap-2">
                <SelectItemText>
                  {{ locale.isArabic ? gov.nameAr : gov.nameEn }}
                </SelectItemText>
                <span v-if="!locale.isArabic" class="text-[11px] text-[var(--muted)]">
                  ({{ gov.nameAr }})
                </span>
                <span
                  v-if="gov.region && locale.isArabic"
                  class="rounded-md bg-[var(--glass)] px-1.5 py-0.5 text-[11px] font-normal text-[var(--muted)]"
                >
                  {{ gov.region }}
                </span>
              </div>

              <!-- Check Indicator at End -->
              <span
                class="absolute end-2.5 flex h-4 w-4 items-center justify-center text-[#E8A020]"
              >
                <SelectItemIndicator>
                  <Check class="h-3.5 w-3.5 stroke-[2.5]" />
                </SelectItemIndicator>
              </span>
            </SelectItem>
          </SelectViewport>

          <SelectScrollDownButton
            class="flex cursor-default items-center justify-center py-1 text-[var(--muted)]"
          >
            <ChevronDown class="h-4 w-4" />
          </SelectScrollDownButton>
        </SelectContent>
      </SelectPortal>
    </SelectRoot>
  </div>
</template>

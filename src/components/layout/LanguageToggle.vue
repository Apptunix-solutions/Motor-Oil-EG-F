<script setup lang="ts">
import { useLocaleStore } from '@/stores/locale'
import { toast } from '@/lib/toast'

const locale = useLocaleStore()

function handleToggle() {
  locale.toggle()
  toast.info(
    locale.isArabic ? 'تم تغيير اللغة إلى العربية' : 'Language switched to English',
    locale.isArabic ? 'واجهة التطبيق باللغة العربية' : 'Application interface updated',
  )
}
</script>

<template>
  <button
    type="button"
    :title="locale.isArabic ? 'Switch to English (EN)' : 'التبديل إلى العربية (ع)'"
    :aria-label="locale.isArabic ? 'Switch to English' : 'التبديل إلى العربية'"
    class="relative inline-flex h-8 min-w-[34px] items-center justify-center rounded-md border border-[var(--line)] bg-[var(--glass)] px-2 text-[12px] font-extrabold text-[var(--text)] transition-all duration-200 hover:border-[#E8A020]/60 hover:bg-[#E8A020]/10 hover:text-[#E8A020] active:scale-95"
    @click="handleToggle"
  >
    <span class="font-black text-[#E8A020]">
      {{ locale.isArabic ? 'EN' : 'ع' }}
    </span>
  </button>
</template>

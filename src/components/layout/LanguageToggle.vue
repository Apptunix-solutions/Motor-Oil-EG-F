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
    :title="locale.isArabic ? 'التبديل إلى الإنجليزية (EN)' : 'Switch to Arabic (ع)'"
    :aria-label="locale.isArabic ? 'التبديل إلى الإنجليزية' : 'Switch to Arabic'"
    class="relative inline-flex h-8 items-center gap-1 rounded-md border border-[var(--line)] bg-[var(--glass)] px-2 text-[12px] font-bold text-[var(--muted)] transition-all duration-200 hover:border-[#E8A020]/50 hover:bg-[#E8A020]/10 hover:text-[#E8A020]"
    @click="handleToggle"
  >
    <span
      class="rounded px-1 transition"
      :class="locale.isArabic ? 'text-[#E8A020] font-black' : 'opacity-40'"
      >ع</span
    >
    <span class="text-[10px] text-[var(--line-strong)]">/</span>
    <span
      class="rounded px-1 text-[11px] transition tracking-tight"
      :class="locale.isEnglish ? 'text-[#E8A020] font-black' : 'opacity-40'"
      >EN</span
    >
  </button>
</template>

<script setup lang="ts">
import { ArrowLeft, Construction } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'

defineProps<{ title: string; eyebrow: string }>()
</script>

<template>
  <div class="flex min-h-[65vh] items-center justify-center py-16">
    <div class="max-w-sm text-center">
      <div
        class="mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-[#E8A020]/20 bg-[#E8A020]/10 text-[#E8A020]"
      >
        <Construction :size="28" />
      </div>
      <p class="mt-7 text-xs font-bold uppercase text-[#E8A020]">
        {{ eyebrow }}
      </p>
      <h1 class="display-font mt-2 text-3xl font-bold text-[var(--text)]">
        {{ title }}
      </h1>
      <p class="mt-3 text-sm leading-relaxed text-[var(--muted)]">
        هذا القسم من تجربة ZaytStore قيد الإنشاء حالياً. تابع تصفّح المتجر وباقي الصفحات بينما نعمل
        على تجهيزه.
      </p>
      <RouterLink
        to="/products"
        class="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#E8A020] px-5 py-3 text-xs font-bold text-[#071F0D] transition hover:bg-[#F5C060]"
        ><ArrowLeft :size="15" /> العودة إلى المتجر</RouterLink
      >
    </div>
  </div>
</template>

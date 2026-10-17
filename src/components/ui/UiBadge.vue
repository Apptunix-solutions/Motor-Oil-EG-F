<script setup lang="ts">
withDefaults(defineProps<{ tone?: 'orange' | 'cyan' | 'neutral' }>(), { tone: 'neutral' })
</script>

<template>
  <span
    class="inline-flex items-center rounded-full border px-2.5 py-1 text-[12px] font-bold"
    :class="{
      'border-[#E8A020]/25 bg-[#E8A020]/[0.1] text-[#E8A020]': tone === 'orange',
      'border-[#0F3D20]/60 bg-[#0F3D20]/25 text-[#7FD6A0]': tone === 'cyan',
      'border-[var(--line)] bg-[var(--glass)] text-[var(--soft)]': tone === 'neutral',
    }"
    ><slot
  /></span>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ as?: string; muted?: boolean }>(), { as: 'div', muted: false })
</script>

<template>
  <component
    :is="as"
    class="rounded-2xl border border-[var(--line)] bg-[var(--panel)] text-[var(--text)] shadow-sm"
    :class="muted ? 'bg-[var(--glass)]' : ''"
    ><slot
  /></component>
</template>

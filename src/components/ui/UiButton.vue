<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'ghost'
    size?: 'default' | 'sm' | 'icon-sm'
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
  }>(),
  { variant: 'primary', size: 'default', type: 'button', disabled: false },
)

const classes = computed(() => ({
  variant: {
    primary:
      'bg-[#E8A020] text-[#071F0D] shadow-sm hover:bg-[#F5C060] focus-visible:ring-[#E8A020]/50',
    secondary:
      'border border-[var(--line)] bg-[var(--glass)] text-[var(--text)] hover:border-[var(--line-strong)] hover:bg-[var(--glass-strong)] focus-visible:ring-[var(--line-strong)]',
    ghost:
      'text-[var(--soft)] hover:bg-[var(--glass)] hover:text-[var(--text)] focus-visible:ring-white/30',
  }[props.variant],
  size: {
    default: 'min-h-10 rounded-xl px-4 py-2.5 text-sm',
    sm: 'min-h-9 rounded-lg px-3 text-xs',
    'icon-sm': 'h-9 w-9 rounded-lg p-0 text-sm',
  }[props.size],
}))
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    class="inline-flex items-center justify-center gap-2 whitespace-nowrap font-bold outline-none transition active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] disabled:pointer-events-none disabled:opacity-50"
    :class="classes"
  >
    <slot />
  </button>
</template>

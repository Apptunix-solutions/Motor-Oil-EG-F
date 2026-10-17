<script setup lang="ts">
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from 'lucide-vue-next'
import { useToast } from '@/lib/toast'

const { toasts, dismiss } = useToast()
</script>

<template>
  <Teleport to="body">
    <div
      class="pointer-events-none fixed bottom-5 left-5 z-[9999] flex flex-col-reverse gap-2.5 sm:bottom-6 sm:left-6"
      dir="rtl"
    >
      <TransitionGroup name="toast">
        <div
          v-for="item in toasts"
          :key="item.id"
          class="pointer-events-auto relative flex w-80 max-w-[calc(100vw-2.5rem)] items-start gap-3 rounded-2xl border p-4 shadow-[0_16px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-all duration-300"
          :class="[
            item.type === 'success' && 'border-emerald-500/30 bg-[var(--panel)] text-[var(--text)]',
            item.type === 'error' && 'border-red-500/30 bg-[var(--panel)] text-[var(--text)]',
            item.type === 'warning' && 'border-amber-500/30 bg-[var(--panel)] text-[var(--text)]',
            item.type === 'info' && 'border-sky-500/30 bg-[var(--panel)] text-[var(--text)]',
          ]"
        >
          <!-- Accent Icon -->
          <div class="mt-0.5 shrink-0">
            <span
              v-if="item.type === 'success'"
              class="grid h-7 w-7 place-items-center rounded-lg bg-emerald-500/15 text-emerald-400"
            >
              <CheckCircle2 :size="16" />
            </span>
            <span
              v-else-if="item.type === 'error'"
              class="grid h-7 w-7 place-items-center rounded-lg bg-red-500/15 text-red-400"
            >
              <AlertCircle :size="16" />
            </span>
            <span
              v-else-if="item.type === 'warning'"
              class="grid h-7 w-7 place-items-center rounded-lg bg-amber-500/15 text-amber-400"
            >
              <AlertTriangle :size="16" />
            </span>
            <span
              v-else
              class="grid h-7 w-7 place-items-center rounded-lg bg-sky-500/15 text-sky-400"
            >
              <Info :size="16" />
            </span>
          </div>

          <!-- Content -->
          <div class="min-w-0 flex-1">
            <h4 class="text-xs font-bold leading-tight text-[var(--text)]">
              {{ item.title }}
            </h4>
            <p v-if="item.description" class="mt-1 text-[11px] leading-relaxed text-[var(--muted)]">
              {{ item.description }}
            </p>
          </div>

          <!-- Close Button with 'X' -->
          <button
            type="button"
            aria-label="إغلاق التنبيه"
            class="grid h-6 w-6 shrink-0 place-items-center rounded-lg border border-[var(--line)] bg-[var(--glass)] text-[var(--muted)] transition-colors hover:border-[var(--line-strong)] hover:bg-[var(--glass-strong)] hover:text-[var(--text)]"
            @click="dismiss(item.id)"
          >
            <X :size="13" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 250ms cubic-bezier(0.16, 1, 0.3, 1);
}
.toast-enter-from {
  opacity: 0;
  transform: translateY(12px) scale(0.96);
}
.toast-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.96);
}
</style>

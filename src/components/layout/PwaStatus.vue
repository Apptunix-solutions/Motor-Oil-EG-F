<script setup lang="ts">
import { Download, WifiOff, X } from 'lucide-vue-next'
import { onMounted, onUnmounted, ref } from 'vue'

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const offline = ref(!navigator.onLine)
const deferredPrompt = ref<InstallPromptEvent | null>(null)
const dismissed = ref(false)

function setOnline() {
  offline.value = false
}
function setOffline() {
  offline.value = true
}
function captureInstall(event: Event) {
  event.preventDefault()
  deferredPrompt.value = event as InstallPromptEvent
}
async function install() {
  if (!deferredPrompt.value) return
  await deferredPrompt.value.prompt()
  deferredPrompt.value = null
}

onMounted(() => {
  window.addEventListener('online', setOnline)
  window.addEventListener('offline', setOffline)
  window.addEventListener('beforeinstallprompt', captureInstall)
})
onUnmounted(() => {
  window.removeEventListener('online', setOnline)
  window.removeEventListener('offline', setOffline)
  window.removeEventListener('beforeinstallprompt', captureInstall)
})
</script>

<template>
  <div
    v-if="!dismissed && (offline || deferredPrompt)"
    class="fixed bottom-24 left-4 right-4 z-50 mx-auto flex max-w-md items-center gap-3 rounded-2xl border border-[var(--line)] bg-[var(--elevated)] p-3 shadow-2xl sm:bottom-6 sm:left-auto sm:right-6"
  >
    <span
      class="grid h-9 w-9 shrink-0 place-items-center rounded-xl"
      :class="offline ? 'bg-[#E8A020]/10 text-[#E8A020]' : 'bg-[#0F3D20]/40 text-[#E8A020]'"
      ><WifiOff v-if="offline" :size="17" /><Download v-else :size="17"
    /></span>
    <p class="flex-1 text-xs leading-relaxed text-[var(--text)]">
      {{
        offline
          ? 'أنت غير متصل بالإنترنت. بيانات سيارتك المحفوظة ما زالت متاحة.'
          : 'خذ ZaytStore معك. ثبّت التطبيق لتجربة أسرع وأداء أفضل.'
      }}
    </p>
    <button
      v-if="deferredPrompt && !offline"
      class="rounded-lg bg-[#E8A020] px-3 py-2 text-[12px] font-bold text-[#071F0D] transition hover:bg-[#F5C060]"
      @click="install"
    >
      تثبيت</button
    ><button aria-label="إغلاق الإشعار" class="text-[var(--muted)]" @click="dismissed = true">
      <X :size="15" />
    </button>
  </div>
</template>

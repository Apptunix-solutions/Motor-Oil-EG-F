<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Lock, Store } from 'lucide-vue-next'
import { useUiStore } from '@/stores/ui'

/**
 * مسار /login و /register:
 * يفتح نافذة المصادقة تلقائياً عند فتح الرابط مباشرة (حفاظاً على تطابق الروابط
 * مع الموقع الحي)، ويرجع المستخدم للصفحة السابقة عند إغلاق النافذة.
 */
const ui = useUiStore()
const route = useRoute()
const router = useRouter()

const mode = route.name === 'register' ? 'register' : 'login'

onMounted(() => {
  ui.openAuth(mode)
})

watch(
  () => ui.isAuthOpen,
  (open) => {
    // إذا أُغلقت النافذة وما زلنا على مسار المصادقة → ارجع للخلف
    if (!open && (route.name === 'login' || route.name === 'register')) {
      const canGoBack = window.history.state?.back
      void router.replace(canGoBack ? String(canGoBack) : '/')
    }
  },
)
</script>

<template>
  <!-- خلفية خفيفة خلف النافذة (تظهر للحظة قبل فتح الـ modal) -->
  <section class="flex min-h-[70vh] flex-col items-center justify-center py-16 text-center">
    <div
      class="grid h-16 w-16 place-items-center rounded-2xl bg-[linear-gradient(135deg,#0F3D20,#0a2b16)] ring-1 ring-[#E8A020]/30"
    >
      <Store v-if="mode === 'register'" :size="26" class="text-[#E8A020]" />
      <Lock v-else :size="24" class="text-[#E8A020]" />
    </div>
    <h1 class="mt-5 text-2xl font-extrabold text-[var(--text)]">
      {{ mode === 'register' ? 'إنشاء حساب' : 'تسجيل الدخول' }}
    </h1>
    <p class="mt-2 text-sm text-[#8E96A3]">جارٍ فتح نافذة تسجيل الدخول…</p>
    <RouterLink
      to="/"
      class="mt-6 inline-flex items-center gap-2 text-[13px] font-bold text-[#E8A020] transition hover:text-[#F5C060]"
    >
      العودة للرئيسية
      <ArrowLeft :size="15" />
    </RouterLink>
  </section>
</template>

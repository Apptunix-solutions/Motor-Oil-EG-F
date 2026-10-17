<script setup lang="ts">
import { ArrowLeft, Home, RefreshCw, Search, Store, TriangleAlert } from 'lucide-vue-next'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { AppError, AppErrorKind } from '@/lib/errors'
import { clearError, createNotFoundError } from '@/lib/errors'
import { UiButton } from '@/components/ui'

const props = withDefaults(defineProps<{ error?: AppError; kind?: AppErrorKind }>(), {
  kind: 'unexpected',
})
const emit = defineEmits<{ retry: []; home: [] }>()
const router = useRouter()

const displayError = computed(
  () =>
    props.error ??
    (props.kind === 'not-found'
      ? createNotFoundError()
      : {
          kind: 'unexpected' as const,
          status: 500,
          code: 'ZYT-500',
          title: 'هناك شيء يحتاج انتباهاً',
          message: 'تعذّر إتمام الطلب. حاول مرة أخرى أو ارجع إلى الصفحة الرئيسية.',
        }),
)
const isNotFound = computed(() => displayError.value.kind === 'not-found')

/**
 * زر العودة للرئيسية: يُطلق الحدث (للتخطيط الذي يستمع إليه) وينقّل فعلياً.
 * سابقاً كان الزر معطلاً تماماً في مسار 404 لأن لا أحد كان يستمع للحدث.
 */
function goHome() {
  emit('home')
  clearError()
  if (router.currentRoute.value.name !== 'home') void router.push('/')
}

function retry() {
  emit('retry')
}
</script>

<template>
  <section class="relative mx-auto flex min-h-[76vh] max-w-3xl items-center justify-center py-16">
    <!-- هالات ضوء خلفية -->
    <div
      class="pointer-events-none absolute -right-24 -top-16 h-72 w-72 rounded-full bg-[#E8A020]/[0.10] blur-3xl"
      aria-hidden="true"
    ></div>
    <div
      class="pointer-events-none absolute -bottom-28 -left-24 h-64 w-64 rounded-full bg-[#0F3D20]/40 blur-3xl"
      aria-hidden="true"
    ></div>

    <div
      class="relative w-full overflow-hidden rounded-[32px] border border-[var(--line)] bg-[var(--panel)] px-6 py-14 text-center shadow-2xl sm:px-14"
    >
      <!-- شريط ذهبي متدرج أعلى البطاقة -->
      <div
        class="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,transparent,#E8A020,transparent)]"
        aria-hidden="true"
      ></div>

      <!-- ═══ المحتوى الأساسي ═══ -->
      <div class="err-content">
        <!-- رقم 404 عملاق بحركة نبض + طبقة متراكبة -->
        <div v-if="isNotFound" class="relative mx-auto flex h-40 items-center justify-center">
          <!-- حلقات نابضة خلف الرقم -->
          <span class="err-ring" aria-hidden="true"></span>
          <span class="err-ring err-ring--delay" aria-hidden="true"></span>
          <!-- قطرة الزيت الطافية -->
          <span class="err-drop" aria-hidden="true">
            <svg viewBox="0 0 64 64" class="h-full w-full">
              <path
                d="M32 6 C32 6,10 30,10 43 C10 55.7,20.2 62,32 62 C43.8 62,54 55.7,54 43 C54 30,32 6,32 6 Z"
                fill="url(#errDropGrad)"
              />
              <path
                d="M18 42 C17 36,21 29,27 23"
                stroke="#fff"
                stroke-width="3.5"
                stroke-linecap="round"
                fill="none"
                opacity="0.4"
              />
              <defs>
                <linearGradient id="errDropGrad" x1="0" y1="0" x2="0.5" y2="1">
                  <stop offset="0%" stop-color="#FFD659" />
                  <stop offset="50%" stop-color="#E8A020" />
                  <stop offset="100%" stop-color="#B87500" />
                </linearGradient>
              </defs>
            </svg>
          </span>
          <span class="err-code display-font">404</span>
        </div>

        <!-- حالة الخطأ العامة -->
        <div
          v-else
          class="mx-auto grid h-20 w-20 place-items-center rounded-[22px] border border-[#E8A020]/40 bg-[var(--bg)] text-[#E8A020] shadow-[0_0_45px_rgba(232,160,32,.14)]"
        >
          <TriangleAlert :size="31" />
        </div>

        <div
          class="mt-7 flex w-fit mx-auto items-center gap-2 rounded-full border border-[#E8A020]/25 bg-[#E8A020]/[0.08] px-3 py-1.5 text-[12px] font-bold uppercase text-[#E8A020]"
        >
          <span class="h-1.5 w-1.5 rounded-full bg-[#E8A020]"></span>
          {{ isNotFound ? 'طريق خاطئ' : 'تنبيه' }}
        </div>

        <p class="mt-5 text-[12px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
          {{ displayError.code }} · {{ displayError.status }}
        </p>

        <h1 class="display-font mt-3 text-4xl font-bold text-[var(--text)] sm:text-5xl">
          {{ displayError.title }}
        </h1>

        <p class="mx-auto mt-5 max-w-md text-sm leading-relaxed text-[var(--muted)]">
          {{ displayError.message }}
        </p>

        <!-- أزرار الإجراء -->
        <div class="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            class="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#E8A020,#c47a10)] px-6 text-[14px] font-extrabold text-white shadow-[0_6px_24px_rgba(232,160,32,0.4)] transition hover:brightness-110"
            @click="goHome"
          >
            <Home :size="16" />
            العودة للرئيسية
            <ArrowLeft :size="15" class="transition group-hover:-translate-x-0.5" />
          </button>

          <button
            v-if="!isNotFound"
            type="button"
            class="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-[var(--line-strong)] bg-[var(--glass)] px-6 text-[14px] font-bold text-[var(--muted)] transition hover:border-[var(--line-strong)] hover:text-[var(--text)]"
            @click="retry"
          >
            <RefreshCw :size="15" />
            حاول مرة أخرى
          </button>

          <UiButton
            v-if="isNotFound"
            variant="secondary"
            class="h-12 rounded-xl px-6"
            @click="router.push('/products')"
          >
            <Search :size="15" /> تصفّح المنتجات
          </UiButton>
        </div>

        <!-- اقتراحات روابط سريعة للـ 404 -->
        <div
          v-if="isNotFound"
          class="mt-9 flex flex-wrap items-center justify-center gap-2 border-t border-[var(--line)] pt-7"
        >
          <span class="mr-1 text-[12px] font-semibold text-[var(--muted)]">جرّب:</span>
          <RouterLink
            to="/products"
            class="inline-flex items-center gap-1.5 rounded-lg border border-[var(--line)] bg-[var(--glass)] px-3 py-1.5 text-[12px] font-semibold text-[var(--muted)] transition hover:border-[#E8A020]/50 hover:text-[#E8A020]"
          >
            <Search :size="13" /> المنتجات
          </RouterLink>
          <RouterLink
            to="/merchants"
            class="inline-flex items-center gap-1.5 rounded-lg border border-[var(--line)] bg-[var(--glass)] px-3 py-1.5 text-[12px] font-semibold text-[var(--muted)] transition hover:border-[#E8A020]/50 hover:text-[#E8A020]"
          >
            <Store :size="13" /> المتاجر
          </RouterLink>
          <RouterLink
            to="/cart"
            class="inline-flex items-center gap-1.5 rounded-lg border border-[var(--line)] bg-[var(--glass)] px-3 py-1.5 text-[12px] font-semibold text-[var(--muted)] transition hover:border-[#E8A020]/50 hover:text-[#E8A020]"
          >
            <Home :size="13" /> السلة
          </RouterLink>
        </div>

        <p class="mt-8 text-[12px] uppercase text-[var(--muted)]">معلوماتك المحفوظة سليمة</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* دخول ناعم للكتل */
.err-content {
  animation: errFadeUp 520ms cubic-bezier(0.22, 1, 0.36, 1) both;
}
@keyframes errFadeUp {
  from {
    opacity: 0;
    transform: translateY(18px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* رقم 404 عملاق بتدرّج مفرّغ + نبض خفيف */
.err-code {
  font-size: clamp(84px, 22vw, 168px);
  line-height: 1;
  font-weight: 800;
  letter-spacing: normal;
  background: linear-gradient(135deg, #f4f5f7 0%, #e8a020 55%, #b87500 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  filter: drop-shadow(0 10px 34px rgba(232, 160, 32, 0.28));
  animation: errPulse 3.6s ease-in-out infinite;
}
@keyframes errPulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.03);
  }
}

/* حلقات نبضية متتالية خلف الرقم */
.err-ring {
  position: absolute;
  width: 176px;
  height: 176px;
  border-radius: 9999px;
  border: 1px solid rgba(232, 160, 32, 0.35);
  animation: errRing 3s ease-out infinite;
}
.err-ring--delay {
  animation-delay: 1.5s;
}
@keyframes errRing {
  0% {
    transform: scale(0.7);
    opacity: 0.7;
  }
  100% {
    transform: scale(1.7);
    opacity: 0;
  }
}

/* قطرة الزيت العائمة أعلى الرقم */
.err-drop {
  position: absolute;
  top: -6px;
  right: 18%;
  width: 34px;
  height: 34px;
  animation: errFloat 3.4s ease-in-out infinite;
}
@keyframes errFloat {
  0%,
  100% {
    transform: translateY(0) rotate(-3deg);
  }
  50% {
    transform: translateY(-10px) rotate(3deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .relative,
  .err-code,
  .err-ring,
  .err-drop {
    animation: none !important;
  }
}
</style>

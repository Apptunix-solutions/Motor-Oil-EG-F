<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Phone,
  Store,
  UserRound,
  X,
} from 'lucide-vue-next'
import { useUiStore, type AuthMode } from '@/stores/ui'
import { useAuthStore } from '@/stores/auth'
import { toast } from '@/lib/toast'

const ui = useUiStore()
const auth = useAuthStore()

const mode = computed({
  get: () => ui.authMode,
  set: (value) => ui.setAuthMode(value),
})

/* ── حقول النماذج ── */
const firstField = ref<HTMLInputElement | null>(null)
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const name = ref('')
const phone = ref('')
const accountType = ref<'customer' | 'merchant'>('customer')
const step = ref<'type' | 'form'>('type')
const loading = ref(false)
const socialLoading = ref<'google' | 'facebook' | null>(null)
const error = ref('')

const canSubmit = computed(() =>
  mode.value === 'login'
    ? email.value.trim().length > 3 && password.value.length >= 6
    : step.value === 'form' &&
      name.value.trim().length >= 2 &&
      /^(?:\+963|00963|0)?9\d{8}$/.test(phone.value.replace(/[\s-]/g, '')) &&
      password.value.length >= 6,
)

/* ── إغلاق بالنقر خارج النافذة أو مفتاح Esc ── */
function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && ui.isAuthOpen) ui.closeAuth()
}

watch(
  () => ui.isAuthOpen,
  async (open) => {
    if (open) {
      step.value = mode.value === 'register' ? 'type' : 'form'
      error.value = ''
      loading.value = false
      socialLoading.value = null
      document.body.style.overflow = 'hidden'
      document.addEventListener('keydown', onKeydown)
      await nextTick()
      firstField.value?.focus()
    } else {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKeydown)
      // إعادة الضبط بعد اختفاء النافذة حتى لا تقفز الحقول
      window.setTimeout(() => {
        if (ui.isAuthOpen) return
        email.value = ''
        password.value = ''
        name.value = ''
        phone.value = ''
        showPassword.value = false
        error.value = ''
        loading.value = false
        socialLoading.value = null
        step.value = 'type'
      }, 320)
    }
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})

function switchMode() {
  const next: AuthMode = mode.value === 'login' ? 'register' : 'login'
  mode.value = next
  step.value = next === 'register' ? 'type' : 'form'
  error.value = ''
  showPassword.value = false
}

function submit() {
  if (!canSubmit.value || loading.value) return
  loading.value = true
  error.value = ''

  window.setTimeout(() => {
    loading.value = false
    if (mode.value === 'login') {
      auth.login({ email: email.value })
      ui.closeAuth()
      toast.success('تم تسجيل الدخول بنجاح', `أهلاً بك مجدداً في ZaytStore`)
    } else {
      auth.login({
        email: email.value || `${phone.value}@zaytstore.sy`,
        name: name.value,
        role: accountType.value,
      })
      ui.closeAuth()
      toast.success('تم إنشاء الحساب بنجاح', `مرحباً بك يا ${name.value} في مجتمع ZaytStore`)
    }
  }, 700)
}

function handleGoogleLogin() {
  if (socialLoading.value) return
  socialLoading.value = 'google'
  window.setTimeout(() => {
    socialLoading.value = null
    auth.loginWithGoogle()
    ui.closeAuth()
    toast.success('تم تسجيل الدخول عبر Google', 'مرحباً بك يا أحمد المحمد في ZaytStore')
  }, 650)
}

function handleFacebookLogin() {
  if (socialLoading.value) return
  socialLoading.value = 'facebook'
  window.setTimeout(() => {
    socialLoading.value = null
    auth.loginWithFacebook()
    ui.closeAuth()
    toast.success('تم تسجيل الدخول عبر Facebook', 'مرحباً بك يا سامر خليل في ZaytStore')
  }, 650)
}
</script>

<template>
  <Teleport to="body">
    <Transition name="auth-backdrop">
      <div
        v-if="ui.isAuthOpen"
        class="fixed inset-0 z-[100] overflow-y-auto p-4 sm:p-6"
        role="dialog"
        aria-modal="true"
        :aria-label="mode === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب'"
      >
        <!-- طبقة الخلفية الضبابية: تغطي الشاشة كلها وتستقبل النقر خارج النافذة للإغلاق -->
        <div
          class="fixed inset-0 bg-black/70 backdrop-blur-md"
          aria-hidden="true"
          @mousedown.self="ui.closeAuth()"
        ></div>

        <!-- غلاف التوسيط: min-h-full يضمن بقاء قمة البطاقة قابلة للوصول حتى على الشاشات القصيرة.
             pointer-events-none يسمح لنقرات الخلفية بالوصول إلى طبقة الإغلاق، والبطاقة تستعيدها -->
        <div
          class="pointer-events-none relative flex min-h-full items-end justify-center sm:items-center"
        >
          <Transition name="auth-card" appear>
            <div
              class="pointer-events-auto relative z-10 w-full max-w-[420px] overflow-hidden rounded-[24px] border border-[var(--line)] bg-[var(--panel)] shadow-[0_24px_64px_rgba(0,0,0,0.6)]"
            >
              <!-- شريط ذهبي علوي متدرج -->
              <div
                class="h-1 w-full bg-[linear-gradient(90deg,transparent,#E8A020,transparent)]"
                aria-hidden="true"
              ></div>

              <!-- زر الإغلاق -->
              <button
                class="absolute left-4 top-5 z-20 grid h-8 w-8 place-items-center rounded-full border border-[var(--line)] bg-[var(--glass)] text-[var(--muted)] transition hover:border-[#E8A020]/50 hover:text-[#E8A020]"
                aria-label="إغلاق"
                @click="ui.closeAuth()"
              >
                <X :size="16" />
              </button>

              <div class="px-6 pb-7 pt-8 sm:px-8">
                <!-- أيقونة الزيت العائمة -->
                <div class="mb-5 flex justify-center">
                  <div
                    class="auth-drop grid h-14 w-14 place-items-center rounded-2xl bg-[linear-gradient(135deg,#0F3D20,#0a2b16)] ring-1 ring-[#E8A020]/30"
                  >
                    <Store v-if="mode === 'register'" :size="24" class="text-[#E8A020]" />
                    <Lock v-else :size="22" class="text-[#E8A020]" />
                  </div>
                </div>

                <!-- ═══ تسجيل الدخول ═══ -->
                <template v-if="mode === 'login'">
                  <h2 class="text-center text-2xl font-extrabold text-[var(--text)]">أهلاً بك</h2>
                  <p class="mt-1.5 text-center text-[13px] leading-relaxed text-[var(--muted)]">
                    سجّل دخولك للمتابعة في ZaytStore
                  </p>

                  <form class="mt-6 space-y-4" novalidate @submit.prevent="submit">
                    <div>
                      <label
                        for="auth-email"
                        class="mb-1.5 block text-[13px] font-semibold text-[var(--soft)]"
                        >البريد الإلكتروني</label
                      >
                      <div class="relative">
                        <Mail
                          :size="16"
                          class="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)]"
                        />
                        <input
                          id="auth-email"
                          ref="firstField"
                          v-model="email"
                          type="email"
                          dir="ltr"
                          autocomplete="email"
                          placeholder="example@email.com"
                          class="h-[46px] w-full rounded-xl border border-[var(--line)] bg-[var(--input)] pr-10 pl-4 text-[14px] text-[var(--text)] outline-none transition placeholder:text-[var(--muted)] focus:border-[#E8A020]/70 focus:ring-2 focus:ring-[#E8A020]/20"
                        />
                      </div>
                    </div>

                    <div>
                      <div class="mb-1.5 flex items-center justify-between">
                        <label
                          for="auth-password"
                          class="text-[13px] font-semibold text-[var(--soft)]"
                          >كلمة المرور</label
                        >
                        <button
                          type="button"
                          class="text-[12px] font-semibold text-[#E8A020] transition hover:text-[#F5C060]"
                        >
                          نسيت كلمة المرور؟
                        </button>
                      </div>
                      <div class="relative">
                        <Lock
                          :size="16"
                          class="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)]"
                        />
                        <input
                          id="auth-password"
                          v-model="password"
                          :type="showPassword ? 'text' : 'password'"
                          dir="ltr"
                          autocomplete="current-password"
                          placeholder="••••••••"
                          class="h-[46px] w-full rounded-xl border border-[var(--line)] bg-[var(--input)] pr-10 pl-11 text-[14px] text-[var(--text)] outline-none transition placeholder:text-[var(--muted)] focus:border-[#E8A020]/70 focus:ring-2 focus:ring-[#E8A020]/20"
                        />
                        <button
                          type="button"
                          class="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)] transition hover:text-[var(--soft)]"
                          :aria-label="showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'"
                          @click="showPassword = !showPassword"
                        >
                          <EyeOff v-if="showPassword" :size="16" />
                          <Eye v-else :size="16" />
                        </button>
                      </div>
                    </div>

                    <p
                      v-if="error"
                      class="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-[12px] text-red-300"
                      role="alert"
                    >
                      {{ error }}
                    </p>

                    <button
                      type="submit"
                      :disabled="!canSubmit || loading"
                      class="group flex h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#E8A020,#c47a10)] text-[15px] font-extrabold text-white shadow-[0_6px_24px_rgba(232,160,32,0.4)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
                    >
                      <Loader2 v-if="loading" :size="17" class="animate-spin" />
                      <template v-else>
                        دخول
                        <ArrowLeft :size="16" class="transition group-hover:-translate-x-0.5" />
                      </template>
                    </button>
                  </form>

                  <div class="my-5 flex items-center gap-3">
                    <span class="h-px flex-1 bg-[var(--glass-strong)]"></span>
                    <span class="text-[12px] font-semibold text-[var(--muted)]">أو</span>
                    <span class="h-px flex-1 bg-[var(--glass-strong)]"></span>
                  </div>

                  <div class="space-y-2.5">
                    <button
                      type="button"
                      :disabled="socialLoading !== null"
                      class="flex h-[46px] w-full items-center justify-center gap-3 rounded-xl border border-[var(--line)] bg-[var(--glass)] text-[13px] font-bold text-[var(--text)] transition hover:border-[#E8A020]/40 hover:bg-[var(--glass-strong)] disabled:opacity-60"
                      @click="handleGoogleLogin"
                    >
                      <Loader2
                        v-if="socialLoading === 'google'"
                        :size="16"
                        class="animate-spin text-[#E8A020]"
                      />
                      <template v-else>
                        <svg viewBox="0 0 24 24" class="h-4 w-4 shrink-0" aria-hidden="true">
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                          />
                        </svg>
                        <span>المتابعة باستخدام Google</span>
                      </template>
                    </button>

                    <button
                      type="button"
                      :disabled="socialLoading !== null"
                      class="flex h-[46px] w-full items-center justify-center gap-3 rounded-xl border border-[var(--line)] bg-[var(--glass)] text-[13px] font-bold text-[var(--text)] transition hover:border-[#1877F2]/50 hover:bg-[var(--glass-strong)] disabled:opacity-60"
                      @click="handleFacebookLogin"
                    >
                      <Loader2
                        v-if="socialLoading === 'facebook'"
                        :size="16"
                        class="animate-spin text-[#1877F2]"
                      />
                      <template v-else>
                        <svg
                          viewBox="0 0 24 24"
                          class="h-4 w-4 shrink-0 fill-[#1877F2]"
                          aria-hidden="true"
                        >
                          <path
                            d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                          />
                        </svg>
                        <span>المتابعة باستخدام Facebook</span>
                      </template>
                    </button>
                  </div>

                  <p class="mt-6 text-center text-[13px] text-[var(--muted)]">
                    ليس لديك حساب؟
                    <button
                      type="button"
                      class="font-bold text-[#E8A020] transition hover:text-[#F5C060]"
                      @click="switchMode"
                    >
                      سجّل الآن
                    </button>
                  </p>
                </template>

                <!-- ═══ إنشاء حساب ═══ -->
                <template v-else>
                  <h2 class="text-center text-2xl font-extrabold text-[var(--text)]">إنشاء حساب</h2>
                  <p class="mt-1.5 text-center text-[13px] leading-relaxed text-[var(--muted)]">
                    {{
                      step === 'type' ? 'اختر نوع حسابك للمتابعة' : 'أكمل بياناتك وابدأ خلال دقيقة'
                    }}
                  </p>

                  <!-- الخطوة 1: اختيار نوع الحساب -->
                  <div v-if="step === 'type'" class="mt-6 space-y-3">
                    <button
                      type="button"
                      class="flex w-full items-center gap-4 rounded-2xl border p-4 text-right transition"
                      :class="
                        accountType === 'customer'
                          ? 'border-[#E8A020]/60 bg-[#E8A020]/10'
                          : 'border-[var(--line)] bg-[var(--glass)] hover:border-[var(--line-strong)]'
                      "
                      @click="accountType = 'customer'"
                    >
                      <span
                        class="grid h-12 w-12 shrink-0 place-items-center rounded-xl transition"
                        :class="
                          accountType === 'customer'
                            ? 'bg-[#E8A020] text-[#071F0D]'
                            : 'bg-[var(--glass-strong)] text-[var(--muted)]'
                        "
                        ><UserRound :size="22"
                      /></span>
                      <span class="min-w-0 flex-1">
                        <span
                          class="flex items-center gap-2 text-[15px] font-extrabold text-[var(--text)]"
                        >
                          زبون
                          <Check
                            v-if="accountType === 'customer'"
                            :size="15"
                            class="text-[#E8A020]"
                          />
                        </span>
                        <span class="mt-0.5 block text-[12px] leading-relaxed text-[var(--muted)]"
                          >تسوق وأطلب منتجات السيارات</span
                        >
                      </span>
                    </button>

                    <button
                      type="button"
                      class="flex w-full items-center gap-4 rounded-2xl border p-4 text-right transition"
                      :class="
                        accountType === 'merchant'
                          ? 'border-[#E8A020]/60 bg-[#E8A020]/10'
                          : 'border-[var(--line)] bg-[var(--glass)] hover:border-[var(--line-strong)]'
                      "
                      @click="accountType = 'merchant'"
                    >
                      <span
                        class="grid h-12 w-12 shrink-0 place-items-center rounded-xl transition"
                        :class="
                          accountType === 'merchant'
                            ? 'bg-[#E8A020] text-[#071F0D]'
                            : 'bg-[var(--glass-strong)] text-[var(--muted)]'
                        "
                        ><Store :size="22"
                      /></span>
                      <span class="min-w-0 flex-1">
                        <span
                          class="flex items-center gap-2 text-[15px] font-extrabold text-[var(--text)]"
                        >
                          تاجر
                          <Check
                            v-if="accountType === 'merchant'"
                            :size="15"
                            class="text-[#E8A020]"
                          />
                        </span>
                        <span class="mt-0.5 block text-[12px] leading-relaxed text-[var(--muted)]"
                          >افتح متجرك وبع منتجاتك على المنصة</span
                        >
                      </span>
                    </button>

                    <button
                      type="button"
                      class="flex h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#E8A020,#c47a10)] text-[15px] font-extrabold text-white shadow-[0_6px_24px_rgba(232,160,32,0.4)] transition hover:brightness-110"
                      @click="step = 'form'"
                    >
                      متابعة
                      <ArrowLeft :size="16" />
                    </button>
                  </div>

                  <!-- الخطوة 2: نموذج البيانات -->
                  <form v-else class="mt-6 space-y-4" novalidate @submit.prevent="submit">
                    <button
                      type="button"
                      class="flex items-center gap-1 text-[12px] font-semibold text-[var(--muted)] transition hover:text-[#E8A020]"
                      @click="step = 'type'"
                    >
                      <ChevronLeft :size="14" class="rotate-180" />
                      تغيير نوع الحساب
                    </button>

                    <div v-if="accountType === 'merchant'">
                      <label
                        for="auth-shop"
                        class="mb-1.5 block text-[13px] font-semibold text-[var(--soft)]"
                        >اسم المتجر</label
                      >
                      <div class="relative">
                        <Store
                          :size="16"
                          class="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)]"
                        />
                        <input
                          id="auth-shop"
                          ref="firstField"
                          v-model="name"
                          type="text"
                          autocomplete="organization"
                          placeholder="مثال: مركز النور للزيوت"
                          class="h-[46px] w-full rounded-xl border border-[var(--line)] bg-[var(--input)] pr-10 pl-4 text-[14px] text-[var(--text)] outline-none transition placeholder:text-[var(--muted)] focus:border-[#E8A020]/70 focus:ring-2 focus:ring-[#E8A020]/20"
                        />
                      </div>
                    </div>

                    <div v-else>
                      <label
                        for="auth-name"
                        class="mb-1.5 block text-[13px] font-semibold text-[var(--soft)]"
                        >الاسم الكامل</label
                      >
                      <div class="relative">
                        <UserRound
                          :size="16"
                          class="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)]"
                        />
                        <input
                          id="auth-name"
                          ref="firstField"
                          v-model="name"
                          type="text"
                          autocomplete="name"
                          placeholder="مثال: عمر حسن"
                          class="h-[46px] w-full rounded-xl border border-[var(--line)] bg-[var(--input)] pr-10 pl-4 text-[14px] text-[var(--text)] outline-none transition placeholder:text-[var(--muted)] focus:border-[#E8A020]/70 focus:ring-2 focus:ring-[#E8A020]/20"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        for="auth-phone"
                        class="mb-1.5 block text-[13px] font-semibold text-[var(--soft)]"
                        >رقم الهاتف</label
                      >
                      <div class="relative">
                        <Phone
                          :size="16"
                          class="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)]"
                        />
                        <input
                          id="auth-phone"
                          v-model="phone"
                          type="tel"
                          dir="ltr"
                          autocomplete="tel"
                          placeholder="09XX XXX XXX"
                          class="h-[46px] w-full rounded-xl border border-[var(--line)] bg-[var(--input)] pr-10 pl-4 text-[14px] text-[var(--text)] outline-none transition placeholder:text-[var(--muted)] focus:border-[#E8A020]/70 focus:ring-2 focus:ring-[#E8A020]/20"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        for="auth-reg-password"
                        class="mb-1.5 block text-[13px] font-semibold text-[var(--soft)]"
                        >كلمة المرور</label
                      >
                      <div class="relative">
                        <Lock
                          :size="16"
                          class="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)]"
                        />
                        <input
                          id="auth-reg-password"
                          v-model="password"
                          :type="showPassword ? 'text' : 'password'"
                          dir="ltr"
                          autocomplete="new-password"
                          placeholder="6 أحرف على الأقل"
                          class="h-[46px] w-full rounded-xl border border-[var(--line)] bg-[var(--input)] pr-10 pl-11 text-[14px] text-[var(--text)] outline-none transition placeholder:text-[var(--muted)] focus:border-[#E8A020]/70 focus:ring-2 focus:ring-[#E8A020]/20"
                        />
                        <button
                          type="button"
                          class="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)] transition hover:text-[var(--soft)]"
                          :aria-label="showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'"
                          @click="showPassword = !showPassword"
                        >
                          <EyeOff v-if="showPassword" :size="16" />
                          <Eye v-else :size="16" />
                        </button>
                      </div>
                    </div>

                    <p
                      v-if="error"
                      class="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-[12px] text-red-300"
                      role="alert"
                    >
                      {{ error }}
                    </p>

                    <button
                      type="submit"
                      :disabled="!canSubmit || loading"
                      class="flex h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#E8A020,#c47a10)] text-[15px] font-extrabold text-white shadow-[0_6px_24px_rgba(232,160,32,0.4)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
                    >
                      <Loader2 v-if="loading" :size="17" class="animate-spin" />
                      <template v-else>إنشاء الحساب</template>
                    </button>
                  </form>

                  <p class="mt-6 text-center text-[13px] text-[var(--muted)]">
                    لديك حساب؟
                    <button
                      type="button"
                      class="font-bold text-[#E8A020] transition hover:text-[#F5C060]"
                      @click="switchMode"
                    >
                      سجّل دخولك
                    </button>
                  </p>
                </template>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* خلفية: تلاشي ناعم */
.auth-backdrop-enter-active,
.auth-backdrop-leave-active {
  transition: opacity 260ms ease;
}
.auth-backdrop-enter-from,
.auth-backdrop-leave-to {
  opacity: 0;
}

/* البطاقة: صعود + تكبير خفيف */
.auth-card-enter-active {
  transition:
    transform 360ms cubic-bezier(0.22, 1, 0.36, 1),
    opacity 300ms ease;
}
.auth-card-leave-active {
  transition:
    transform 220ms ease,
    opacity 200ms ease;
}
.auth-card-enter-from {
  opacity: 0;
  transform: translateY(24px) scale(0.96);
}
.auth-card-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.98);
}

/* الأيقونة تطفو برقة زيت — من حركة floatDrop في الموقع الحي */
.auth-drop {
  animation: authDropFloat 3.4s ease-in-out infinite;
}
@keyframes authDropFloat {
  0%,
  100% {
    transform: translateY(0) rotate(-3deg);
  }
  50% {
    transform: translateY(-6px) rotate(3deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .auth-drop {
    animation: none;
  }
  .auth-card-enter-active,
  .auth-card-leave-active {
    transition: opacity 150ms ease;
  }
  .auth-card-enter-from,
  .auth-card-leave-to {
    transform: none;
  }
}
</style>

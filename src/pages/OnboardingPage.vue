<script setup lang="ts">
import { ref } from 'vue'
import { ArrowLeft, CarFront, Check, ShieldCheck, Truck } from 'lucide-vue-next'
import { RouterLink, useRouter } from 'vue-router'
import { useOnboardingStore } from '@/stores/onboarding'
import { UiButton } from '@/components/ui'

const router = useRouter()
const onboarding = useOnboardingStore()
const slide = ref(0)
const slides = [
  {
    eyebrow: '01 · اختر زيت سيارتك',
    title: 'الزيت المناسب، من أول مرة.',
    copy: 'أخبرنا عن سيارتك وسنقترح عليك الزيت الأنسب — مناسب لظروف الطرق السورية والمناخ.',
    icon: CarFront,
  },
  {
    eyebrow: '02 · تسوّق بثقة',
    title: 'أصلي 100%، دائماً.',
    copy: 'كل منتج على ZaytStore يأتي من موزعين معتمدين — لا تقليد، ولا جودة متنازل عنها.',
    icon: ShieldCheck,
  },
  {
    eyebrow: '03 · توصيل سريع',
    title: 'نوصل إليك في كل سوريا.',
    copy: 'من دمشق إلى حلب، ومن اللاذقية إلى السويداء — نوصّل الزيوت والمواد الأصلية إلى بابك.',
    icon: Truck,
  },
]
function next() {
  if (slide.value < slides.length - 1) slide.value += 1
}
function skip() {
  onboarding.finish()
  router.push('/')
}
function finish() {
  onboarding.finish()
}
</script>

<template>
  <div class="mx-auto flex min-h-[75vh] max-w-xl flex-col justify-center py-14 text-center">
    <div
      class="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#E8A020] text-[#071F0D] shadow-[0_0_35px_rgba(232,160,32,.25)]"
    >
      <component :is="slides[slide].icon" :size="30" />
    </div>
    <div class="mt-12 min-h-[215px]">
      <p class="text-xs font-bold text-[#E8A020]">
        {{ slides[slide].eyebrow }}
      </p>
      <h1
        class="display-font mt-3 text-4xl font-bold leading-[1.15] text-[var(--text)] sm:text-6xl"
      >
        {{ slides[slide].title }}<span class="text-[#E8A020]">.</span>
      </h1>
      <p class="mx-auto mt-5 max-w-sm text-sm leading-relaxed text-[var(--muted)]">
        {{ slides[slide].copy }}
      </p>
    </div>
    <div class="mx-auto mt-7 flex gap-2">
      <span
        v-for="(_, index) in slides"
        :key="index"
        class="h-1.5 rounded-full transition-all"
        :class="index === slide ? 'w-8 bg-[#E8A020]' : 'w-1.5 bg-white/20'"
      ></span>
    </div>
    <UiButton v-if="slide < slides.length - 1" class="mx-auto mt-10 h-12 px-6" @click="next"
      >التالي <ArrowLeft :size="17" /></UiButton
    ><RouterLink
      v-else
      to="/profile"
      class="mx-auto mt-10 inline-flex h-12 items-center gap-2 rounded-xl bg-[#E8A020] px-6 text-sm font-bold text-[#071F0D] hover:bg-[#F5C060]"
      @click="finish"
      >أضف سيارتي <Check :size="17" /></RouterLink
    ><button class="mt-6 text-xs text-[var(--muted)] hover:text-[var(--text)]" @click="skip">
      تخطَّ الآن
    </button>
  </div>
</template>

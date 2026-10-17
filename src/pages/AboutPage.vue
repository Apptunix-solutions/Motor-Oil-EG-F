<script setup lang="ts">
import { MapPin, PackageCheck, ShieldCheck, Store, Target, Truck } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'

const pillars = [
  {
    icon: Store,
    title: 'للتجار',
    copy: 'نوفر للتجار منصة متكاملة لإدارة متاجرهم، عرض منتجاتهم، وإدارة الطلبات بكل سهولة ومن أي مكان.',
  },
  {
    icon: ShieldCheck,
    title: 'الجودة والأمان',
    copy: 'كل متجر على المنصة يمر بمراجعة من فريقنا قبل التفعيل لضمان جودة المنتجات وحماية حقوق المستخدمين.',
  },
  {
    icon: Truck,
    title: 'التوصيل',
    copy: 'نغطي معظم المحافظات السورية بشبكة توصيل موثوقة بأسعار واضحة ومحددة مسبقاً.',
  },
]

const stats = [
  { value: '+10', label: 'متجر موثّق' },
  { value: '+100', label: 'منتج متاح' },
  { value: '14', label: 'محافظة مغطاة' },
]
</script>

<template>
  <div class="pb-14 pt-8 sm:pt-12">
    <p class="text-[12px] font-bold uppercase text-[#E8A020]">من نحن</p>
    <h1
      class="display-font mt-2 max-w-3xl text-4xl font-bold leading-[1.15] text-[var(--text)] sm:text-5xl"
    >
      من نحن<span class="text-[#E8A020]">.</span>
    </h1>
    <p class="mt-5 max-w-3xl text-sm leading-loose text-[var(--muted)]">
      ZaytStore هي منصة سورية متخصصة تجمع أفضل تجار زيوت السيارات وقطع الغيار في مكان واحد، لتوفير
      تجربة تسوق سهلة وموثوقة لكل سوري.
    </p>

    <div
      class="mt-7 flex w-fit items-center gap-2 rounded-full border border-[#E8A020]/25 bg-[#E8A020]/[0.08] px-4 py-2 text-[12px] font-bold text-[#E8A020]"
    >
      <Target :size="15" /> مهمتنا
    </div>
    <p class="mt-3 max-w-3xl text-sm leading-loose text-[var(--soft)]">
      تسهيل الوصول إلى منتجات زيوت السيارات وقطع الغيار الأصلية والمعتمدة بأسعار تنافسية مباشرة من
      التجار الموثوقين.
    </p>

    <div class="mt-10 grid gap-4 sm:grid-cols-3">
      <div
        v-for="pillar in pillars"
        :key="pillar.title"
        class="rounded-[22px] border border-[var(--line)] bg-[var(--panel)] p-6"
      >
        <span class="grid h-11 w-11 place-items-center rounded-xl bg-[#E8A020]/10 text-[#E8A020]">
          <component :is="pillar.icon" :size="20" />
        </span>
        <h2 class="mt-4 text-sm font-bold text-[var(--text)]">{{ pillar.title }}</h2>
        <p class="mt-2 text-xs leading-loose text-[var(--muted)]">{{ pillar.copy }}</p>
      </div>
    </div>

    <section class="mt-12 rounded-[26px] border border-[var(--line)] bg-[var(--panel)] p-6 sm:p-9">
      <div class="flex items-center gap-3">
        <PackageCheck :size="18" class="text-[#E8A020]" />
        <h2 class="text-base font-bold text-[var(--text)]">المنصة بالأرقام</h2>
      </div>
      <div class="mt-7 grid grid-cols-3 gap-4 text-center">
        <div v-for="stat in stats" :key="stat.label">
          <p class="display-font text-3xl font-bold text-[#E8A020] sm:text-4xl">
            {{ stat.value }}
          </p>
          <p class="mt-2 text-[12px] text-[var(--muted)]">{{ stat.label }}</p>
        </div>
      </div>
    </section>

    <section
      class="mt-8 rounded-[26px] border border-[#E8A020]/25 bg-[#E8A020]/[0.06] p-6 text-center sm:p-10"
    >
      <div
        class="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#E8A020] text-[#071F0D]"
      >
        <MapPin :size="22" />
      </div>
      <h2 class="display-font mt-5 text-2xl font-bold text-[var(--text)]">
        هل أنت تاجر وتريد فتح متجرك؟
      </h2>
      <p class="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-[var(--soft)]">
        انضم إلى ZaytStore وابدأ ببيع منتجاتك لآلاف العملاء عبر منصتنا بخطوات بسيطة.
      </p>
      <RouterLink
        to="/register"
        class="mt-6 inline-flex h-11 items-center rounded-xl bg-[#E8A020] px-6 text-sm font-bold text-[#071F0D] transition hover:bg-[#F5C060]"
        >افتح متجرك الآن ←</RouterLink
      >
    </section>
  </div>
</template>

<script setup lang="ts">
const updated = 'أبريل 2026'
const email = 'zaytstore.hass@gmail.com'

const sections = [
  {
    title: '1. المعلومات التي نجمعها',
    intro: 'عند إنشاء حساب أو استخدام خدماتنا، قد نجمع المعلومات التالية:',
    items: [
      'الاسم وعنوان البريد الإلكتروني ورقم الهاتف',
      'معلومات الطلبات والمشتريات',
      'بيانات الجهاز وعنوان IP وسجلات الاستخدام',
      'المعلومات المقدمة عبر نماذج التواصل',
    ],
  },
  {
    title: '2. كيف نستخدم معلوماتك',
    intro: '',
    items: [
      'تقديم الخدمات وتنفيذ الطلبات',
      'التواصل معك بشأن طلباتك وحسابك',
      'تحسين المنصة وتطوير الخدمات',
      'الامتثال للمتطلبات القانونية',
    ],
  },
  {
    title: '3. مشاركة المعلومات',
    intro:
      'لا نبيع بياناتك الشخصية لأطراف ثالثة. قد نشارك معلوماتك فقط مع التجار المعنيين بطلبك، أو عند الضرورة القانونية.',
    items: [],
  },
  {
    title: '4. حماية البيانات',
    intro:
      'نستخدم بروتوكول HTTPS لتشفير جميع الاتصالات، ونخزّن بياناتك بشكل آمن عبر منصة Supabase المعتمدة على معايير أمان عالية.',
    items: [],
  },
  {
    title: '5. ملفات تعريف الارتباط (Cookies)',
    intro:
      'نستخدم ملفات الارتباط لإدارة جلسات المستخدمين وتحسين تجربة الاستخدام. يمكنك تعطيلها من إعدادات متصفحك.',
    items: [],
  },
  {
    title: '6. حقوقك',
    intro: '',
    items: [
      'طلب الاطلاع على بياناتك الشخصية',
      'طلب تصحيح أو حذف بياناتك',
      'سحب موافقتك على معالجة البيانات',
    ],
  },
]
</script>

<template>
  <article class="pb-14 pt-8 sm:pt-12">
    <p class="text-[12px] font-bold uppercase text-[#E8A020]">قانوني</p>
    <h1 class="display-font mt-2 text-4xl font-bold text-[var(--text)] sm:text-5xl">
      سياسة الخصوصية<span class="text-[#E8A020]">.</span>
    </h1>
    <p class="mt-3 text-xs text-[var(--muted)]">آخر تحديث: {{ updated }}</p>

    <div class="mt-8 max-w-3xl space-y-8">
      <section v-for="section in sections" :key="section.title">
        <h2 class="text-base font-bold text-[var(--text)]">{{ section.title }}</h2>
        <p v-if="section.intro" class="mt-3 text-sm leading-loose text-[var(--soft)]">
          {{ section.intro }}
        </p>
        <ul v-if="section.items.length" class="mt-3 space-y-2">
          <li
            v-for="item in section.items"
            :key="item"
            class="flex gap-3 rounded-xl border border-[var(--line)] bg-[var(--panel)] px-4 py-3 text-sm text-[var(--soft)]"
          >
            <span class="text-[#E8A020]">•</span>
            <span class="leading-relaxed">{{ item }}</span>
          </li>
        </ul>
      </section>

      <section>
        <h2 class="text-base font-bold text-[var(--text)]">7. تواصل معنا</h2>
        <p class="mt-3 text-sm leading-loose text-[var(--soft)]">
          لأي استفسار حول سياسة الخصوصية، تواصل معنا عبر البريد الإلكتروني:
          <a
            href="mailto:zaytstore.hass@gmail.com"
            class="font-semibold text-[#E8A020] hover:underline"
            >{{ email }}</a
          >
        </p>
      </section>
    </div>
  </article>
</template>

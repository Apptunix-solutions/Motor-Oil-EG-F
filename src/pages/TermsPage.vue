<script setup lang="ts">
const updated = 'أبريل 2026'
const email = 'zaytstore.hass@gmail.com'

const sections = [
  {
    title: '1. القبول بالشروط',
    intro:
      'باستخدامك لمنصة ZaytStore، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق عليها، يرجى التوقف عن استخدام المنصة.',
    items: [],
  },
  {
    title: '2. وصف الخدمة',
    intro:
      'ZaytStore هي منصة وسيطة تربط بين المشترين وتجار زيوت السيارات وقطع الغيار في سوريا. لا تتحمل المنصة مسؤولية المنتجات المباعة بشكل مباشر، إذ يتحمل كل تاجر مسؤولية منتجاته.',
    items: [],
  },
  {
    title: '3. حسابات المستخدمين',
    intro: '',
    items: [
      'يجب أن تكون المعلومات المقدمة صحيحة ودقيقة',
      'أنت مسؤول عن الحفاظ على سرية كلمة مرورك',
      'يُمنع إنشاء حسابات متعددة أو مزيفة',
      'نحتفظ بحق تعليق أي حساب ينتهك الشروط',
    ],
  },
  {
    title: '4. الطلبات والمدفوعات',
    intro: '',
    items: [
      'الأسعار المعروضة بالليرة السورية أو الدولار الأميركي وتخضع للتغيير',
      'يتم تأكيد الطلب بعد موافقة التاجر',
      'تتم المدفوعات وفق الطرق المتاحة في المنصة',
      'في حالة إلغاء الطلب، يتم التواصل مع التاجر مباشرة',
    ],
  },
  {
    title: '5. سلوك المستخدم',
    intro: 'يُحظر على المستخدمين:',
    items: [
      'نشر محتوى مضلل أو مسيء',
      'محاولة اختراق أو التلاعب بالمنصة',
      'انتهاك حقوق الملكية الفكرية',
      'استخدام المنصة لأغراض غير قانونية',
    ],
  },
  {
    title: '6. إخلاء المسؤولية',
    intro:
      'تُقدَّم المنصة "كما هي" دون ضمانات صريحة أو ضمنية. لا تتحمل ZaytStore مسؤولية الأضرار الناجمة عن استخدام المنصة أو عن جودة المنتجات المقدمة من التجار.',
    items: [],
  },
  {
    title: '7. التعديلات',
    intro:
      'نحتفظ بحق تعديل هذه الشروط في أي وقت. سيتم إشعار المستخدمين بأي تغييرات جوهرية عبر البريد الإلكتروني أو إشعار داخل المنصة.',
    items: [],
  },
]
</script>

<template>
  <article class="pb-14 pt-8 sm:pt-12">
    <p class="text-[12px] font-bold uppercase text-[#E8A020]">قانوني</p>
    <h1 class="display-font mt-2 text-4xl font-bold text-[var(--text)] sm:text-5xl">
      شروط الاستخدام<span class="text-[#E8A020]">.</span>
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
        <h2 class="text-base font-bold text-[var(--text)]">8. التواصل</h2>
        <p class="mt-3 text-sm leading-loose text-[var(--soft)]">
          لأي استفسار حول شروط الاستخدام، تواصل معنا على:
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

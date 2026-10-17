import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import ErrorPage from '@/pages/ErrorPage.vue'
import { reportError } from '@/lib/errors'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // ══════════════════════════════════════════════════════
    // 1. الرئيسية والمتجر (Storefront & Catalog)
    // ══════════════════════════════════════════════════════
    {
      path: '/',
      name: 'home',
      component: HomePage,
      meta: { title: 'الرئيسية' },
    },
    {
      path: '/products',
      alias: '/catalog',
      name: 'products',
      component: () => import('@/pages/CatalogPage.vue'),
      meta: { title: 'المنتجات والزيوت' },
    },
    {
      path: '/product/:slug',
      name: 'product',
      component: () => import('@/pages/ProductPage.vue'),
      meta: { title: 'تفاصيل المنتج' },
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('@/pages/SearchPage.vue'),
      meta: { title: 'البحث' },
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('@/pages/CartPage.vue'),
      meta: { title: 'سلة المشتريات' },
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: () => import('@/pages/CheckoutPage.vue'),
      meta: { title: 'إتمام الطلب' },
    },

    // ══════════════════════════════════════════════════════
    // 2. دليل التجار والمتاجر (Merchants Directory)
    // ══════════════════════════════════════════════════════
    {
      path: '/merchants',
      name: 'merchants',
      component: () => import('@/pages/MerchantsPage.vue'),
      meta: { title: 'دليل التجار والموردين' },
    },
    {
      path: '/merchants/:id',
      name: 'merchant-detail',
      component: () => import('@/pages/MerchantDetailPage.vue'),
      meta: { title: 'تفاصيل المتجر' },
    },

    // ══════════════════════════════════════════════════════
    // 3. الحساب الشخصي والكراج (Unified Profile & Account)
    // ══════════════════════════════════════════════════════
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/pages/ProfilePage.vue'),
      meta: { title: 'الملف الشخصي' },
    },
    // اختصارات التبويبات المباشرة — تحويل آمن لمنع تكرار المكونات وتوحيد الحالة
    {
      path: '/garage',
      redirect: '/profile?tab=garage',
    },
    {
      path: '/orders',
      redirect: '/profile?tab=orders',
    },
    {
      path: '/notifications',
      redirect: '/profile?tab=notifications',
    },
    {
      path: '/addresses',
      redirect: '/profile?tab=addresses',
    },
    {
      path: '/settings',
      redirect: '/profile?tab=settings',
    },
    // إضافة وتعديل بيانات المركبة
    {
      path: '/garage/add',
      name: 'garage-add',
      component: () => import('@/pages/VehiclePage.vue'),
      meta: { title: 'إضافة سيارة إلى الكراج' },
    },

    // ══════════════════════════════════════════════════════
    // 4. المصادقة وتسجيل الدخول (Auth Direct Routes)
    // ══════════════════════════════════════════════════════
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/AuthRoutePage.vue'),
      meta: { title: 'تسجيل الدخول' },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/pages/AuthRoutePage.vue'),
      meta: { title: 'إنشاء حساب جديد' },
    },

    // ══════════════════════════════════════════════════════
    // 5. الصفحات التعريفية والمعلومات (Legal & Info)
    // ══════════════════════════════════════════════════════
    {
      path: '/about',
      name: 'about',
      component: () => import('@/pages/AboutPage.vue'),
      meta: { title: 'من نحن' },
    },
    {
      path: '/privacy',
      name: 'privacy',
      component: () => import('@/pages/PrivacyPage.vue'),
      meta: { title: 'سياسة الخصوصية' },
    },
    {
      path: '/terms',
      name: 'terms',
      component: () => import('@/pages/TermsPage.vue'),
      meta: { title: 'الشروط والأحكام' },
    },
    {
      path: '/delivery',
      name: 'delivery',
      component: () => import('@/pages/PlaceholderPage.vue'),
      props: { title: 'معلومات التوصيل', eyebrow: 'الشحن والتوصيل' },
      meta: { title: 'معلومات التوصيل' },
    },
    {
      path: '/partners',
      name: 'partners',
      component: () => import('@/pages/PlaceholderPage.vue'),
      props: { title: 'برنامج الشركاء', eyebrow: 'شراكات' },
      meta: { title: 'برنامج الشركاء' },
    },
    {
      path: '/help',
      name: 'help',
      component: () => import('@/pages/PlaceholderPage.vue'),
      props: { title: 'مركز المساعدة', eyebrow: 'الدعم' },
      meta: { title: 'مركز المساعدة' },
    },

    // ══════════════════════════════════════════════════════
    // 6. التهيئة والأخطاء (Onboarding & Errors)
    // ══════════════════════════════════════════════════════
    {
      path: '/onboarding',
      name: 'onboarding',
      component: () => import('@/pages/OnboardingPage.vue'),
      meta: { title: 'تهيئة الحساب' },
    },
    {
      path: '/error',
      name: 'error',
      component: ErrorPage,
      meta: { title: 'حدث خطأ' },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: ErrorPage,
      props: { kind: 'not-found' },
      meta: { title: 'الصفحة غير موجودة' },
    },
  ],
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0, behavior: 'smooth' }
  },
})

// تحديث عنوان نافذة المتصفح تلقائياً عند التنقل بين الصفحات
router.afterEach((to) => {
  const pageTitle = to.meta.title as string | undefined
  document.title = pageTitle
    ? `${pageTitle} — ZaytStore`
    : 'ZaytStore — المتجر الأول لزيوت السيارات في سوريا'
})

// التقاط أخطاء التنقل وتسجيلها
router.onError((error) => {
  reportError(error, 'router navigation')
})

export default router

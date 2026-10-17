import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import CatalogPage from '@/pages/CatalogPage.vue'
import ProductPage from '@/pages/ProductPage.vue'
import CartPage from '@/pages/CartPage.vue'
import CheckoutPage from '@/pages/CheckoutPage.vue'
import ProfilePage from '@/pages/ProfilePage.vue'
import SearchPage from '@/pages/SearchPage.vue'
import VehiclePage from '@/pages/VehiclePage.vue'
import OnboardingPage from '@/pages/OnboardingPage.vue'
import ErrorPage from '@/pages/ErrorPage.vue'
import { reportError } from '@/lib/errors'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomePage },
    // نفس بنية روابط zaytstores.com (SEO: /products, /merchants, /about, /privacy, /terms)
    { path: '/products', alias: '/catalog', name: 'products', component: CatalogPage },
    {
      path: '/merchants',
      name: 'merchants',
      component: () => import('@/pages/MerchantsPage.vue'),
    },
    // صفحة تفاصيل المتجر — كانت الروابط تشير إليها بدون مسار فتؤدي لصفحة 404
    {
      path: '/merchants/:id',
      name: 'merchant-detail',
      component: () => import('@/pages/MerchantDetailPage.vue'),
    },
    { path: '/about', name: 'about', component: () => import('@/pages/AboutPage.vue') },
    { path: '/privacy', name: 'privacy', component: () => import('@/pages/PrivacyPage.vue') },
    { path: '/terms', name: 'terms', component: () => import('@/pages/TermsPage.vue') },
    { path: '/onboarding', name: 'onboarding', component: OnboardingPage },
    { path: '/search', name: 'search', component: SearchPage },
    { path: '/product/:slug', name: 'product', component: ProductPage },
    { path: '/garage/add', name: 'garage-add', component: VehiclePage },
    { path: '/cart', name: 'cart', component: CartPage },
    { path: '/checkout', name: 'checkout', component: CheckoutPage },
    { path: '/garage', name: 'garage', component: ProfilePage },
    { path: '/profile', name: 'profile', component: ProfilePage },
    { path: '/notifications', redirect: '/profile?tab=notifications' },
    { path: '/orders', redirect: '/profile?tab=orders' },
    // فتح نافذة المصادقة عند زيارة الرابط مباشرة (تطبيق روابط الموقع الحي)
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/AuthRoutePage.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/pages/AuthRoutePage.vue'),
    },
    {
      path: '/delivery',
      name: 'delivery',
      component: () => import('@/pages/PlaceholderPage.vue'),
      props: { title: 'معلومات التوصيل', eyebrow: 'الشحن والتوصيل' },
    },
    {
      path: '/partners',
      name: 'partners',
      component: () => import('@/pages/PlaceholderPage.vue'),
      props: { title: 'برنامج الشركاء', eyebrow: 'شراكات' },
    },
    {
      path: '/help',
      name: 'help',
      component: () => import('@/pages/PlaceholderPage.vue'),
      props: { title: 'مركز المساعدة', eyebrow: 'الدعم' },
    },
    { path: '/error', name: 'error', component: ErrorPage },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: ErrorPage,
      props: { kind: 'not-found' },
    },
  ],
  scrollBehavior(_to, _from, savedPosition) {
    return savedPosition ?? { top: 0 }
  },
})

router.onError((error) => {
  reportError(error, 'router navigation')
})

export default router

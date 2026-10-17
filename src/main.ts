import './assets/main.css'

import { createApp } from 'vue'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { MotionPlugin } from '@vueuse/motion'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { installGlobalErrorHandling } from './lib/errors'

const app = createApp(App)
installGlobalErrorHandling(app)
app.use(createPinia()).use(router).use(VueQueryPlugin).use(MotionPlugin).mount('#app')

/* أخفِ شاشة التحميل الأولى بعد جهوز التطبيق (بدون وميض) */
window.clearTimeout(window.__zsSplashTimer)
requestAnimationFrame(() => {
  document.getElementById('zayt-splash')?.classList.add('is-hidden')
})

import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useOnboardingStore = defineStore('onboarding', () => {
  const complete = ref(localStorage.getItem('zaytstore-onboarding-complete') === 'true')

  function finish() {
    complete.value = true
    localStorage.setItem('zaytstore-onboarding-complete', 'true')
  }

  return { complete, finish }
})

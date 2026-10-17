import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { z } from 'zod'
import { readStored, writeStored } from '@/lib/storage'

const STORAGE_KEY = 'zaytstore-wishlist'

export const useWishlistStore = defineStore('wishlist', () => {
  const ids = ref<string[]>(readStored(STORAGE_KEY, z.array(z.string()).max(500), []))
  const count = computed(() => ids.value.length)

  function toggle(id: string) {
    ids.value = ids.value.includes(id)
      ? ids.value.filter((item) => item !== id)
      : [...ids.value, id]
    writeStored(STORAGE_KEY, ids.value)
  }
  function has(id: string) {
    return ids.value.includes(id)
  }

  return { ids, count, toggle, has }
})

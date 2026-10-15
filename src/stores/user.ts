import { ref } from 'vue'
import { defineStore } from 'pinia'
import { z } from 'zod'
import { readStored, writeStored } from '@/lib/storage'
import { vehicleSchema } from '@/stores/vehicle'
import type { UserPreferences } from '@/types/user'

const STORAGE_KEY = 'motor-oil-eg-preferences'

const defaultPreferences: UserPreferences = {
  name: '',
  email: '',
  vehicle: null,
  notifications: true,
}

const preferencesSchema = z.object({
  name: z.string().max(80),
  email: z.string().max(254),
  vehicle: vehicleSchema.nullable(),
  notifications: z.boolean(),
})

export const useUserStore = defineStore('user', () => {
  const preferences = ref<UserPreferences>(
    readStored(STORAGE_KEY, preferencesSchema, defaultPreferences),
  )

  function update(next: Partial<UserPreferences>) {
    preferences.value = { ...preferences.value, ...next }
    writeStored(STORAGE_KEY, preferences.value)
  }

  return { preferences, update }
})

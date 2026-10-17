import { ref } from 'vue'
import { defineStore } from 'pinia'
import { z } from 'zod'
import { readStored, removeStored, writeStored } from '@/lib/storage'
import type { Vehicle } from '@/types/vehicle'

const STORAGE_KEY = 'zaytstore-vehicle'

export const vehicleSchema = z.object({
  make: z.string().max(60),
  model: z.string().max(60),
  year: z.number().int().min(1950).max(2100),
  engine: z.string().max(60),
})

export const useVehicleStore = defineStore('vehicle', () => {
  const vehicle = ref<Vehicle | null>(readStored(STORAGE_KEY, vehicleSchema.nullable(), null))

  function select(nextVehicle: Vehicle) {
    vehicle.value = nextVehicle
    writeStored(STORAGE_KEY, nextVehicle)
  }

  function clear() {
    vehicle.value = null
    removeStored(STORAGE_KEY)
  }

  return { vehicle, select, clear }
})

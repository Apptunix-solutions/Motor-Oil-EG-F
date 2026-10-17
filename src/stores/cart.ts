import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { z } from 'zod'
import { products } from '@/data/products'
import { readStored, writeStored } from '@/lib/storage'
import type { CartLine } from '@/types/cart'
import type { Product } from '@/types/product'

export const MAX_QUANTITY_PER_ITEM = 20
const STORAGE_KEY = 'zaytstore-cart'

const cartSchema = z.record(z.string(), z.number().int().positive().max(MAX_QUANTITY_PER_ITEM))

function loadCart() {
  const saved = readStored(STORAGE_KEY, cartSchema, {})
  return Object.fromEntries(
    Object.entries(saved).filter(([id]) => products.some((product) => product.id === id)),
  )
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<Record<string, number>>(loadCart())
  const count = computed(() =>
    Object.values(items.value).reduce((total, quantity) => total + quantity, 0),
  )
  const lines = computed<CartLine[]>(() =>
    Object.entries(items.value).flatMap(([id, quantity]) => {
      const product = products.find((candidate) => candidate.id === id)
      return product ? [{ product, quantity }] : []
    }),
  )
  const subtotal = computed(() =>
    lines.value.reduce((total, line) => total + line.product.price * line.quantity, 0),
  )

  function add(product: Product) {
    const current = items.value[product.id] ?? 0
    if (current >= MAX_QUANTITY_PER_ITEM) return
    items.value[product.id] = current + 1
    persist()
  }

  function quantity(id: string) {
    return items.value[id] ?? 0
  }

  function remove(id: string) {
    const current = items.value[id]
    if (!current) return
    if (current <= 1) delete items.value[id]
    else items.value[id] = current - 1
    persist()
  }

  function clear(id: string) {
    delete items.value[id]
    persist()
  }

  function clearAll() {
    items.value = {}
    persist()
  }

  function persist() {
    writeStored(STORAGE_KEY, items.value)
  }

  return { items, count, lines, subtotal, add, remove, clear, clearAll, quantity }
})

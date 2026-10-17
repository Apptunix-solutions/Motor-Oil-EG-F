import { beforeEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ProductCard from '../product/ProductCard.vue'
import { products } from '../../data/products'
import { MAX_QUANTITY_PER_ITEM, useCartStore } from '../../stores/cart'
import { useOrdersStore } from '../../stores/orders'
import { checkoutSchema } from '../../lib/validators'

const validCheckout = {
  email: 'driver@example.com',
  phone: '0912 345 678',
  name: 'عمر حسن',
  street: 'شارع الثورة 14',
  city: 'دمشق',
  postalCode: '11511',
}

beforeEach(() => {
  localStorage.clear()
  setActivePinia(createPinia())
})

describe('ProductCard', () => {
  it('renders product details and supports adding to cart', async () => {
    const wrapper = mount(ProductCard, {
      props: { product: products[0] },
      global: { stubs: { RouterLink: { template: '<a><slot /></a>' } } },
    })

    expect(wrapper.text()).toContain('10W40 4L')
    await wrapper.get('button[aria-label="أضف 10W40 4L إلى السلة"]').trigger('click')
    expect(useCartStore().count).toBe(1)
  })
})

describe('Cart store', () => {
  it('calculates a persistent cart subtotal', () => {
    const cart = useCartStore()
    cart.add(products[0])
    cart.add(products[0])
    expect(cart.count).toBe(2)
    expect(cart.subtotal).toBe(30)
    expect(JSON.parse(localStorage.getItem('zaytstore-cart') ?? '{}')[products[0].id]).toBe(2)
  })

  it('caps quantity per item', () => {
    const cart = useCartStore()
    for (let i = 0; i < MAX_QUANTITY_PER_ITEM + 5; i++) cart.add(products[0])
    expect(cart.quantity(products[0].id)).toBe(MAX_QUANTITY_PER_ITEM)
  })

  it('discards corrupt or tampered storage instead of crashing', () => {
    localStorage.setItem('zaytstore-cart', '{not json')
    expect(useCartStore().count).toBe(0)

    setActivePinia(createPinia())
    localStorage.setItem(
      'zaytstore-cart',
      JSON.stringify({ [products[0].id]: -5, 'unknown-product': 3 }),
    )
    expect(useCartStore().count).toBe(0)
  })

  it('drops unknown product ids but keeps valid ones', () => {
    localStorage.setItem(
      'zaytstore-cart',
      JSON.stringify({ [products[0].id]: 2, 'unknown-product': 3 }),
    )
    expect(useCartStore().count).toBe(2)
  })
})

describe('Orders store', () => {
  it('creates unique order ids and refuses empty orders', () => {
    const orders = useOrdersStore()
    const line = [{ product: products[0], quantity: 1 }]
    const address = { name: 'A', street: 'B', city: 'C', postalCode: '11511' }
    const first = orders.create(line, address, 42.9)
    const second = orders.create(line, address, 42.9)
    expect(first.id).not.toBe(second.id)
    expect(() => orders.create([], address, 0)).toThrow()
  })
})

describe('Checkout validation', () => {
  it('accepts valid details and normalises the phone number', () => {
    expect(checkoutSchema.parse(validCheckout).phone).toBe('0912345678')
  })

  it('rejects incomplete or malformed details', () => {
    expect(checkoutSchema.safeParse({ ...validCheckout, email: 'not-an-email' }).success).toBe(
      false,
    )
    expect(checkoutSchema.safeParse({ ...validCheckout, phone: '12345' }).success).toBe(false)
    expect(checkoutSchema.safeParse({ ...validCheckout, postalCode: 'abc' }).success).toBe(false)
    expect(checkoutSchema.safeParse({ ...validCheckout, name: 'x'.repeat(200) }).success).toBe(
      false,
    )
  })
})

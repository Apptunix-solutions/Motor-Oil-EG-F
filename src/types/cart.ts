import type { Product } from './product'

export interface CartLine {
  product: Product
  quantity: number
}

export interface OrderAddress {
  name: string
  street: string
  city: string
  postalCode: string
  phone?: string
}

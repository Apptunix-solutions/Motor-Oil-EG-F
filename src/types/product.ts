export type OilBase = 'كامل التخليق' | 'شبه تخليقي' | 'معدني'

export type ProductCategory =
  | 'Engine Oil'
  | 'Oil Filter'
  | 'Air Filter'
  | 'Fuel Filter'
  | 'Transmission'
  | 'Brake Fluid'

export interface Review {
  id: string
  author: string
  rating: number
  date: string
  body: string
  verified: boolean
}

export interface Product {
  id: string
  slug: string
  name: string
  brand: string
  category: ProductCategory
  viscosity: string
  volume: string
  base: OilBase
  price: number
  originalPrice?: number
  rating: number
  reviewCount: number
  images: string[]
  image: string
  stock: number
  specs: Record<string, string>
  description: string
  reviews: Review[]
  compatibleMakes: string[]
  tags: string[]
  merchantId: string
  merchantName: string
  isBestseller?: boolean
  isNew?: boolean
}

export interface Merchant {
  id: string
  name: string
  tagline: string
  rating: number
  reviewCount: number
  productCount: number
  phone?: string
  image?: string
  isFounder?: boolean
}

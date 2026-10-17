import type { Component } from 'vue'
import { Cog, Disc3, Droplets, Fuel, Funnel, LayoutGrid, Wind } from 'lucide-vue-next'
import type { ProductCategory } from '@/types/product'

export interface CategoryEntry {
  /** Matches the live zaytstores.com `?category=` query value (used for SEO deep links). */
  slug: string
  /** Product.category value used inside the app. */
  value: ProductCategory | 'All'
  label: string
  /** أيقونة lucide حقيقية (بدل الإيموجي) لعرضها داخل الأزرار وبطاقات الفئات. */
  icon: Component
}

/**
 * الفئات المعتمدة على zaytstores.com — نفس الأسماء ونفس قيم الاستعلام
 * حتى تتطابق روابط التصفح مع نسخة الموقع الحية.
 */
export const categories: CategoryEntry[] = [
  { slug: 'all', value: 'All', label: 'الكل', icon: LayoutGrid },
  { slug: 'engine-oils', value: 'Engine Oil', label: 'زيوت المحركات', icon: Droplets },
  { slug: 'oil-filters', value: 'Oil Filter', label: 'مصافي الزيت', icon: Funnel },
  { slug: 'air-filters', value: 'Air Filter', label: 'مصافي الهواء', icon: Wind },
  { slug: 'fuel-filters', value: 'Fuel Filter', label: 'مصافي الوقود', icon: Fuel },
  { slug: 'transmission-oils', value: 'Transmission', label: 'زيوت ناقل الحركة', icon: Cog },
  { slug: 'brake-fluids', value: 'Brake Fluid', label: 'زيوت الفرامل', icon: Disc3 },
]

export function categoryBySlug(slug?: string): CategoryEntry {
  return categories.find((entry) => entry.slug === slug) ?? categories[0]
}

export function categoryLabel(value: ProductCategory | 'All'): string {
  return categories.find((entry) => entry.value === value)?.label ?? 'الكل'
}

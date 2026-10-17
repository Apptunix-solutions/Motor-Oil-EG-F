import type { Merchant } from '@/types/product'

/**
 * المتاجر المنشورة فعلياً على zaytstores.com/merchants
 * المعرّفات هي نفسها معرّفات المسارات الحيّة حتى تتطابق الروابط.
 */
export const merchants: Merchant[] = [
  {
    id: 'a7e85877-d9db-4e4c-a133-272906a712bb',
    name: 'مراكز العثمان',
    tagline: 'وكالة زيوت ماتركس',
    rating: 5.0,
    reviewCount: 3,
    productCount: 0,
    isFounder: true,
  },
  {
    id: 'f59cdff0-7bc8-4aad-8217-d4117bc363af',
    name: 'مركز محمد منير ليلى',
    tagline: 'زيوت رانيول الالمانية',
    rating: 4.8,
    reviewCount: 20,
    productCount: 8,
    phone: '0983229062',
    image: 'https://res.cloudinary.com/dochvbmww/image/upload/v1776160525/kvbc5bnsopjer137nmw3.jpg',
    isFounder: true,
  },
  {
    id: 'ab9c8d28-bdda-4867-8d60-abdfffb38d5b',
    name: 'king oil',
    tagline: 'زيوت محركات وسواد وزيوت ناقل حركة',
    rating: 5.0,
    reviewCount: 1,
    productCount: 16,
  },
  {
    id: '33c2fc2a-6ed7-47a7-8d4c-ae7a59bc2f9c',
    name: 'مركز ستور',
    tagline: 'زيوت وفلاتر بأسعار الجملة',
    rating: 5.0,
    reviewCount: 1,
    productCount: 1,
  },
  {
    id: '0824cc3c-3b93-4ea5-885a-914a25efa7ed',
    name: 'زيوت سوليس-SOLIS',
    tagline: 'الوكيل و الموزع الحصري لزيوت سوليس في سوريا',
    rating: 0,
    reviewCount: 0,
    productCount: 0,
  },
  {
    id: 'b3f8de57-cfac-4807-abbd-cedcbc4f8ed9',
    name: 'متجر الزيوت الذهبية',
    tagline: 'زيوت أوروبية مستوردة عالية الجودة',
    rating: 0,
    reviewCount: 0,
    productCount: 0,
  },
  {
    id: '5aeaf9cc-4314-4f79-a86e-969e51b2f681',
    name: 'سوبر للعناية بالسيارات',
    tagline: 'زيوت',
    rating: 0,
    reviewCount: 0,
    productCount: 0,
  },
  {
    id: 'bec904e3-1233-49bd-bdf8-7126b97d7506',
    name: 'شركة ياقوت أويل',
    tagline: 'زيوت محركات مصافي وفلاتر',
    rating: 0,
    reviewCount: 0,
    productCount: 0,
  },
  {
    id: '788d70f7-0c87-4a75-a23f-11668161d548',
    name: 'German gold car oil syria',
    tagline: 'نحن وكلاء الزيوت الالمانيه german gold تجاره زيوت السيارات العالمبه',
    rating: 0,
    reviewCount: 0,
    productCount: 0,
  },
]

export const merchantById = (id: string) => merchants.find((entry) => entry.id === id)

/** المتاجر الظاهرة في صفحة الرئيسية «أبرز المتاجر». */
export const featuredMerchantIds = [
  'f59cdff0-7bc8-4aad-8217-d4117bc363af',
  'a7e85877-d9db-4e4c-a133-272906a712bb',
  'ab9c8d28-bdda-4867-8d60-abdfffb38d5b',
  '33c2fc2a-6ed7-47a7-8d4c-ae7a59bc2f9c',
  'bec904e3-1233-49bd-bdf8-7126b97d7506',
  '0824cc3c-3b93-4ea5-885a-914a25efa7ed',
]

export const featuredMerchants = featuredMerchantIds
  .map((id) => merchantById(id))
  .filter((entry): entry is Merchant => Boolean(entry))

import { z } from 'zod'

/** أرقام الهواتف السورية: 09XXXXXXXX أو ‎+9639XXXXXXXX‎ */
const syrianMobile = /^(?:\+963|00963|0)?9\d{8}$/

export const checkoutSchema = z.object({
  email: z.string().trim().pipe(z.email('أدخل بريداً إلكترونياً صحيحاً').max(254)),
  phone: z
    .string()
    .trim()
    .transform((value) => value.replace(/[\s-]/g, ''))
    .pipe(z.string().regex(syrianMobile, 'أدخل رقم هاتف سوري صحيحاً (09XXXXXXXX)')),
  name: z.string().trim().min(2, 'أدخل اسمك الكامل').max(80, 'الاسم طويل جداً'),
  street: z.string().trim().min(4, 'أدخل عنوان التوصيل').max(120, 'العنوان طويل جداً'),
  city: z.string().trim().min(2, 'أدخل محافظتك').max(60, 'اسم المحافظة طويل جداً'),
  postalCode: z
    .string()
    .trim()
    .regex(/^\d{5}$/, 'أدخل رمز بريدي من 5 أرقام'),
})

export type CheckoutForm = z.input<typeof checkoutSchema>
export type CheckoutField = keyof CheckoutForm

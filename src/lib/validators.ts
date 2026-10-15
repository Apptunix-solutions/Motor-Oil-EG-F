import { z } from 'zod'

const egyptianMobile = /^(?:\+20|0020|0)?1[0125]\d{8}$/

export const checkoutSchema = z.object({
  email: z.string().trim().pipe(z.email('Enter a valid email').max(254)),
  phone: z
    .string()
    .trim()
    .transform((value) => value.replace(/[\s-]/g, ''))
    .pipe(z.string().regex(egyptianMobile, 'Enter a valid Egyptian mobile number')),
  name: z.string().trim().min(2, 'Enter your full name').max(80, 'Name is too long'),
  street: z.string().trim().min(4, 'Enter a delivery address').max(120, 'Address is too long'),
  city: z.string().trim().min(2, 'Enter your city').max(60, 'City is too long'),
  postalCode: z
    .string()
    .trim()
    .regex(/^\d{5}$/, 'Enter a 5-digit postal code'),
})

export type CheckoutForm = z.input<typeof checkoutSchema>
export type CheckoutField = keyof CheckoutForm

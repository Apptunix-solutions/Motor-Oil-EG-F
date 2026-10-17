/**
 * تنسيق السعر كما يظهر على zaytstores.com: 15 $ / 81 $
 * (الدولار الأمريكي هو عملة العرض المعتمدة على الموقع).
 */
export function formatPrice(value: number) {
  const amount = Number.isInteger(value) ? String(value) : value.toFixed(2)
  return `${amount} $`
}

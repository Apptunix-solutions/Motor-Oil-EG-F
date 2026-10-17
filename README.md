# ZaytStore — منصة زيوت السيارات في سوريا

ZaytStore (زيت ستور) is a mobile-first Syrian marketplace for premium motor oils, lubricants,
filters, and vehicle fluids. It is a 1:1 rebuild of [zaytstores.com](https://zaytstores.com):
the same catalog, merchants, categories, and Arabic (RTL) wording. All prices are in USD
(displayed as `15 $`). The whole interface is Arabic-first (`lang="ar" dir="rtl"`) with the
Cairo typeface. Location context defaults to Damascus, Syria.

## Stack

- Vue 3.5 + TypeScript with `<script setup lang="ts">` (Composition API only)
- Vite 7
- Tailwind CSS 3.4 with PostCSS/Autoprefixer via `tailwind.config.js`
- Vue Router 4
- Pinia with `pinia-plugin-persistedstate` for cart, vehicle, wishlist, and preferences
- VeeValidate + Zod for checkout form validation
- Lucide Vue Next icons
- Vite PWA plugin with offline shell and install prompt
- Vitest + Vue Test Utils

## Run locally

```sh
npm install
npm run dev
```

The repository uses npm and `package-lock.json`. Production checks:

```sh
npm run type-check   # vue-tsc --build
npm run lint         # ESLint 9 --max-warnings=0
npm run test:unit -- --run
npm run build
```

## Routes

| Path                                                 | Page                     | Notes                                            |
| ---------------------------------------------------- | ------------------------ | ------------------------------------------------ |
| `/`                                                  | `HomePage.vue`           | Hero, categories, bestsellers, merchants CTA     |
| `/products`                                          | `CatalogPage.vue`        | Filterable catalog (alias `/catalog`)            |
| `/merchants`                                         | `MerchantsPage.vue`      | All 9 verified merchants (supports `?q=` search) |
| `/merchants/:id`                                     | `MerchantDetailPage.vue` | Merchant profile, rating, products               |
| `/product/:slug`                                     | `ProductPage.vue`        | Gallery, specs, reviews, add-to-cart             |
| `/search`                                            | `SearchPage.vue`         | Debounced search with recent history             |
| `/about`                                             | `AboutPage.vue`          | About ZaytStore                                  |
| `/privacy`                                           | `PrivacyPage.vue`        | Privacy policy                                   |
| `/terms`                                             | `TermsPage.vue`          | Terms of service                                 |
| `/onboarding`                                        | `OnboardingPage.vue`     | Arabic onboarding slides                         |
| `/garage`                                            | `ProfilePage.vue`        | Saved vehicles, orders, sign out                 |
| `/garage/add`                                        | `VehiclePage.vue`        | Make → Model → Year → Engine selector            |
| `/cart`                                              | `CartPage.vue`           | Persistent bag with quantities and totals        |
| `/checkout`                                          | `CheckoutPage.vue`       | Delivery/payment form and confirmation           |
| `/login` `/register` `/delivery` `/partners` `/help` | `PlaceholderPage.vue`    | Arabic stubs                                     |
| `/error`                                             | `ErrorPage.vue`          | Error display                                    |

**Bottom nav (mobile):** الرئيسية (`/`) · المنتجات (`/products`) · السلة (`/cart`) · حسابي (`/garage`)

## Architecture

- `src/pages` — route-level views
- `src/components/product` — reusable product presentation
- `src/components/ui` — custom UI primitives (`UiButton`, `UiCard`, `UiBadge`, `UiAccordion`)
- `src/components/layout` — `AppFooter`, `ErrorBoundary`, `PwaStatus`
- `src/data` — the real zaytstores.com catalog: 25 products, 9 merchants, 6 categories (USD)
- `src/stores` — Pinia stores: cart, vehicle, user, wishlist, onboarding, orders, ui (`zaytstore-*` localStorage keys)
- `src/types` — domain models: `Product`, `CartLine`, `OrderAddress`, `Vehicle`
- `src/lib` — pure utilities: `cn()`, `formatPrice()`, `validators.ts`, `errors.ts`
- `src/router` — all route definitions and `onError` handler

## Design system

The visual system is defined in `src/assets/base.css` (CSS variables), `src/assets/main.css`
(Tailwind imports + the Cairo Google Font), and `tailwind.config.js` (custom color tokens: `ink`,
`panel`, `elevated`, `orange` (gold `#E8A020`), `green` (deep `#0F3D20`)). Dark surfaces, gold
actions, green brand panels, rounded cards, and bold Cairo display typography are shared across
all screens. Arabic-first sizing: 12px minimum for labels, no negative letter-spacing, generous
line-height. No `<style scoped>` blocks — all styling via Tailwind utility classes.

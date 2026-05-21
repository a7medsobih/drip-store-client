# Drip Store Client

**Admin Dashboard + Storefront** — A modern, scalable Angular e-commerce frontend built with **Angular 21**, **Standalone Components**, **Signals**, and **Tailwind CSS v4**.

This project includes both:

- **Customer-facing Storefront** — browse, cart, checkout, and profile
- **Admin Dashboard** — full system management for catalog, orders, users, and more

---

## Key Features

| Area | Capabilities |
|------|----------------|
| **Auth** | Login, Register, Forgot / Reset password, session refresh |
| **State** | Signal-based state (no NgRx) |
| **Storefront** | Products, cart, checkout, home sections, testimonials |
| **Admin** | Products, orders, users, testimonials, categories |
| **API** | Typed responses, lazy-loaded dashboard routes, interceptor pipeline |
| **Roles** | User vs Admin UI separation with route guards |
| **UI** | Reusable components, skeletons, Tailwind v4 design system |
| **Uploads** | FormData-ready structure for image uploads |

---

## Tech Stack

- **Angular 21** — Standalone components architecture
- **TypeScript**
- **Tailwind CSS v4**
- **RxJS** + **Angular Signals**
- **HttpClient** with functional interceptors
- **JWT** — access token in memory; refresh via API + `withCredentials` (cookie-aware)

---

## Architecture Overview

Feature-based modular layout:

```
core/       → Global services, models, interceptors, guards
shared/     → Reusable UI components & pipes
website/    → Customer-facing storefront
dashboard/  → Admin panel (separate domain)
auth/       → Authentication flow isolated from business logic
```

**State management:** Angular Signals only — no external state library.

### Authentication Strategy

| Token | Storage |
|-------|---------|
| **Access token** | In-memory signal (`AuthService.accessToken`) |
| **Refresh token** | Session storage when returned by API; refresh requests use `withCredentials` for cookie-based flows |

**On app init:** `restoreSession()` → refresh token → fetch profile.

**HTTP interceptor (`authInterceptor`):**

1. Attach `Authorization: Bearer <accessToken>` to protected routes
2. On `401` → call `refreshToken()` → retry the original request
3. On refresh failure → clear session and logout

### Roles

| Role | Access |
|------|--------|
| `user` | Storefront, profile, cart, checkout |
| `admin` | Full `/dashboard/*` routes |

Protected by `adminGuard` and `adminChildGuard` on dashboard routes.

---

## Project Structure

```
drip-store-client/
├── src/
│   ├── environments/
│   │   ├── env-development.ts
│   │   └── env-production.ts
│   │
│   └── app/
│       ├── auth/              # login, register, forgot/reset password
│       ├── core/              # models, services, interceptors, guards, constants
│       ├── shared/            # components, pipes, skeletons
│       ├── website/           # layout + storefront pages
│       ├── dashboard/         # layout, components, pages, services
│       ├── app.routes.ts
│       ├── app.config.ts
│       └── app.ts
│
├── docs/
│   ├── drip_store.postman_collection.json
│   ├── API_Reference.txt
│   └── folderStructure.txt
│
└── README.md
```

For the full generated tree, see [`docs/folderStructure.txt`](docs/folderStructure.txt).

---

## Main Modules

### Storefront (`website/`)

| Route | Page |
|-------|------|
| `/` | Home (hero, featured, best sellers, testimonials) |
| `/products` | Product listing |
| `/product/:id` | Product details |
| `/cart` | Shopping cart |
| `/checkout` | Checkout |
| `/profile` | User profile |

### Admin Dashboard (`dashboard/`)

Lazy-loaded under `/dashboard` (requires admin role):

| Route | Page |
|-------|------|
| `/dashboard/overview` | Overview & analytics |
| `/dashboard/products` | Products management |
| `/dashboard/categories` | Categories & subcategories |
| `/dashboard/orders` | Orders tracking & status |
| `/dashboard/users` | Users management |
| `/dashboard/testimonials` | Testimonials moderation |

### Auth (`auth/`)

| Route | Page |
|-------|------|
| `/login` | Login |
| `/register` | Register |
| `/forgot-password` | Forgot password |
| `/reset-password` | Reset password |

---

## API Integration

- Centralized in `core/services` and feature services (e.g. `dashboard/services`)
- Typed wrappers via `ApiResponse<T>`
- Query filtering support (pagination, search, filters)
- FormData support for image uploads
- Dashboard routes use `loadComponent` for code splitting

**Backend reference:** [`docs/drip_store.postman_collection.json`](docs/drip_store.postman_collection.json)

Configure the API base URL in environment files:

```ts
// src/environments/env-development.ts
export const environment = {
  apiURL: 'http://localhost:3000/api/v1',
  staticFilesURL: 'http://localhost:3000/api/files',
  baseURL: 'http://localhost:3000',
  production: false,
};
```

---

## Getting Started

### Prerequisites

- **Node.js** 18+ (project uses npm 10)
- **Angular CLI** 21 (`npm install -g @angular/cli` optional — local CLI via `npx ng` works)

### Install & run

```bash
npm install
npm start
```

Open **http://localhost:4200**

### Other scripts

```bash
npm run build    # Production build → dist/
npm run watch    # Development build with watch
npm test         # Unit tests (Vitest via Angular CLI)
```

---

## Development Notes

- **No NgRx** — signals and services only
- **SPA** — no full page reload after updates
- **Admin actions** — guarded by role checks on dashboard routes
- **UI** — modular shared and dashboard-specific components
- **Separation** — API logic stays in services; components focus on presentation

Path aliases (see `tsconfig.json`): `@auth`, `@core`, `@shared`, `@website`, `@dashboard`, `@app`.

---

## Author

**Ahmed Sobih**

- GitHub: [your-profile](https://ahmedsobih-portfolio.vercel.app)
- LinkedIn: [your-profile](https://www.linkedin.com/in/ahmedsobih/)

---

## License

Private project — see repository owner for usage terms.

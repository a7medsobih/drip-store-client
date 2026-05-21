import { Routes } from '@angular/router';

import { Login } from '@auth/login/login';
import { ForgotPassword } from '@auth/forgot-password/forgot-password';
import { Register } from '@auth/register/register';
import { ResetPassword } from '@auth/reset-password/reset-password';
import { NotFound } from '@app/not-found/not-found';
import { adminChildGuard, adminGuard } from '@core/guards/admin.guard';
import { DashboardShell } from '@dashboard/layout/dashboard-shell/dashboard-shell';
import { MainLayout } from '@website/layout/main-layout/main-layout';
import { Cart } from '@website/pages/cart/cart';
import { Checkout } from '@website/pages/checkout/checkout';
import { Home } from '@website/pages/home/home';
import { ProductDetail } from '@website/pages/product-detail/product-detail';
import { Products } from '@website/pages/products/products';
import { Profile } from '@website/pages/profile/profile';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      { path: '', component: Home, pathMatch: 'full' },
      { path: 'products', component: Products },
      { path: 'product/:id', component: ProductDetail },
      { path: 'cart', component: Cart },
      { path: 'checkout', component: Checkout },
      { path: 'profile', component: Profile },
    ],
  },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'forgot-password', component: ForgotPassword },
  { path: 'reset-password', component: ResetPassword },
  {
    path: 'dashboard',
    component: DashboardShell,
    canActivate: [adminGuard],
    canActivateChild: [adminChildGuard],
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      {
        path: 'overview',
        data: {
          dashboardTitle: 'Overview',
          dashboardSubtitle: 'Track the daily health of the admin workspace.',
        },
        loadComponent: () =>
          import('@dashboard/pages/overview/overview').then((m) => m.Overview),
      },
      {
        path: 'products',
        data: {
          dashboardTitle: 'Products',
          dashboardSubtitle: 'Keep the catalog polished, stocked, and ready to publish.',
        },
        loadComponent: () =>
          import('@dashboard/pages/products/products').then((m) => m.Products),
      },
      {
        path: 'categories',
        data: {
          dashboardTitle: 'Categories',
          dashboardSubtitle: 'Guide storefront structure with a clear taxonomy.',
        },
        loadComponent: () =>
          import('@dashboard/pages/categories/categories').then((m) => m.Categories),
      },
      {
        path: 'orders',
        data: {
          dashboardTitle: 'Orders',
          dashboardSubtitle: 'Follow fulfillment flow and protect delivery quality.',
        },
        loadComponent: () =>
          import('@dashboard/pages/orders/orders').then((m) => m.Orders),
      },
      {
        path: 'users',
        data: {
          dashboardTitle: 'Users',
          dashboardSubtitle: 'Manage workspace access and keep team ownership clear.',
        },
        loadComponent: () =>
          import('@dashboard/pages/users/users').then((m) => m.Users),
      },
      {
        path: 'testimonials',
        data: {
          dashboardTitle: 'Testimonials',
          dashboardSubtitle: 'Moderate customer reviews before they appear on the storefront.',
        },
        loadComponent: () =>
          import('@dashboard/pages/testimonials/testimonials').then((m) => m.Testimonials),
      },
      {
        path: 'reports',
        redirectTo: 'overview',
        pathMatch: 'full',
      },
    ],
  },
  { path: '**', component: NotFound },
];

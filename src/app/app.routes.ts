import { Routes } from '@angular/router';

import { Login } from '@auth/login/login';
import { ForgotPassword } from '@auth/forgot-password/forgot-password';
import { Register } from '@auth/register/register';
import { ResetPassword } from '@auth/reset-password/reset-password';
import { NotFound } from '@app/not-found/not-found';
import { DashboardLayout } from '@dashboard/layout/dashboard-layout/dashboard-layout';
import { Categories } from '@dashboard/pages/categories/categories';
import { Orders } from '@dashboard/pages/orders/orders';
import { Overview } from '@dashboard/pages/overview/overview';
import { Products as DashboardProducts } from '@dashboard/pages/products/products';
import { Users } from '@dashboard/pages/users/users';
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
    component: DashboardLayout,
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: Overview },
      { path: 'products', component: DashboardProducts },
      { path: 'categories', component: Categories },
      { path: 'orders', component: Orders },
      { path: 'users', component: Users },
    ],
  },
  { path: '**', component: NotFound },
];

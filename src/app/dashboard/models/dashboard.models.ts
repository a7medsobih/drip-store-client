import type { Pagination } from '@core/models/product.model';

export type DashboardTone = 'primary' | 'secondary' | 'danger' | 'neutral';
export type DashboardStatus =
  | 'pending'
  | 'preparing'
  | 'shipped'
  | 'received'
  | 'cancelledByUser'
  | 'cancelledByAdmin'
  | 'refused'
  | 'approved'
  | 'active'
  | 'inactive';

export interface DashboardNavigationItem {
  label: string;
  route: string;
  icon: string;
  exact?: boolean;
}

export interface DashboardNavigationSection {
  title: string;
  items: DashboardNavigationItem[];
}

export interface DashboardAction {
  label: string;
  icon?: string;
  route?: string;
  variant?: 'primary' | 'secondary';
}

export interface DashboardStat {
  id: string;
  label: string;
  value: string;
  change?: string;
  icon: string;
  hint?: string;
}

export interface DashboardQuickAction {
  id: string;
  eyebrow?: string;
  title: string;
  description: string;
  icon: string;
  actionLabel: string;
  route?: string;
}

export interface DashboardEmptyStateConfig {
  icon: string;
  title: string;
  description: string;
  actionLabel?: string;
  route?: string;
}

export interface DashboardTableColumn {
  key: string;
  label: string;
  align?: 'left' | 'right';
  width?: string;
}

export interface DashboardTextCell {
  type: 'text';
  value: string;
  tone?: 'default' | 'muted' | 'primary';
  secondary?: string;
}

export interface DashboardImageCell {
  type: 'image';
  title: string;
  subtitle?: string;
  image?: string;
}

export interface DashboardBadgeCell {
  type: 'badge';
  label: string;
  tone: DashboardTone;
}

export interface DashboardProgressCell {
  type: 'progress';
  label: string;
  value: number;
  tone?: DashboardTone;
}

export type DashboardTableCell =
  | string
  | DashboardTextCell
  | DashboardImageCell
  | DashboardBadgeCell
  | DashboardProgressCell;

export interface DashboardTableRow {
  id: string;
  [key: string]: DashboardTableCell;
}

export interface DashboardTableConfig {
  columns: DashboardTableColumn[];
  rows: DashboardTableRow[];
  emptyState?: DashboardEmptyStateConfig;
}

export interface DashboardOverviewRecentOrder {
  id: string;
  userName: string;
  total: number;
  status: DashboardStatus;
  createdAt: string;
}

export interface DashboardOverview {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  totalUsers: number;
  lowStockProducts: number;
  recentOrders: DashboardOverviewRecentOrder[];
  pendingTestimonialsCount: number;
}

export type { Pagination, Product, ProductsResponse } from '@core/models/product.model';

export interface ProductsAdminQueryParams {
  page: number;
  limit: number;
  categoryId?: string;
  isActive?: string;
  search?: string;
}

export interface CatalogCategory {
  _id: string;
  title: string;
  isActive: boolean;
  isDeleted?: boolean;
  createdAt?: string;
}

export interface CatalogSubcategory {
  _id: string;
  title: string;
  categoryId: string | { _id: string; name: string };
  isActive: boolean;
  isDeleted?: boolean;
  createdAt?: string;
}

export interface CategoryPayload {
  title: string;
  isActive: boolean;
}

export interface SubcategoryPayload {
  title: string;
  categoryId: string;
  isActive?: boolean;
}

export type OrderStatus = Extract<
  DashboardStatus,
  | 'pending'
  | 'preparing'
  | 'shipped'
  | 'received'
  | 'cancelledByUser'
  | 'cancelledByAdmin'
  | 'refused'
>;

export interface OrderLineItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  _id: string;
  userId: string;
  userName: string;
  phoneNumber: string;
  address: string;
  totalPrice: number;
  status: OrderStatus;
  products: OrderLineItem[];
  createdAt: string;
}

export interface OrdersListResponse {
  items: Order[];
  pagination: Pagination;
}

export interface OrdersQueryParams {
  page: number;
  limit: number;
  status?: string;
  from?: string;
  to?: string;
  search?: string;
}

export interface User {
  _id: string;
  name: string;
  mobile: string;
  email: string;
  gender: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export interface UsersListData {
  users: User[];
  total: number;
  page: number;
}

export interface UsersQueryParams {
  page: number;
  limit: number;
  search?: string;
}

export type TestimonialStatus = 'pending' | 'approved' | 'refused';

export interface AdminTestimonial {
  _id: string;
  userId: string;
  userName: string;
  comment: string;
  stars: number;
  status: TestimonialStatus;
  createdAt: string;
}

export interface TestimonialsListData {
  testimonials: AdminTestimonial[];
  total: number;
  page: number;
}

export interface TestimonialsQueryParams {
  page: number;
  limit?: number;
  status?: string;
  stars?: string;
  from?: string;
  to?: string;
}

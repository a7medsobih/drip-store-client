import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import {
  DashboardEmptyState,
  DashboardPageHeader,
  DashboardStatCardSkeleton,
  DashboardTable,
  DashboardTableSkeleton,
  QuickActionCard,
  StatCard,
} from '@dashboard/components';
import { DashboardStatus, DashboardTableColumn } from '@dashboard/models/dashboard.models';
import { DashboardService } from '@dashboard/services/dashboard.service';

@Component({
  selector: 'app-overview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DashboardEmptyState,
    DashboardPageHeader,
    DashboardStatCardSkeleton,
    DashboardTable,
    DashboardTableSkeleton,
    QuickActionCard,
    StatCard,
  ],
  templateUrl: './overview.html',
})
export class Overview {
  private readonly dashboardService = inject(DashboardService);
  private readonly router = inject(Router);

  protected readonly overview = signal<import('@dashboard/models/dashboard.models').DashboardOverview | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  protected readonly recentOrdersColumns: DashboardTableColumn[] = [
    { key: 'id', label: 'Order ID', width: '18%' },
    { key: 'userName', label: 'Customer', width: '24%' },
    { key: 'totalLabel', label: 'Total', width: '16%', align: 'right' },
    { key: 'status', label: 'Status', width: '20%' },
    { key: 'createdAtLabel', label: 'Date', width: '22%' },
  ];

  protected readonly recentOrdersRows = computed(() =>
    (this.overview()?.recentOrders ?? []).map((order) => ({
      ...order,
      totalLabel: this.formatCurrency(order.total),
      createdAtLabel: this.formatDate(order.createdAt),
    })),
  );

  protected readonly statCards = computed(() => {
    const data = this.overview();
    if (!data) return [];

    return [
      { title: 'Total Revenue', value: this.formatCurrency(data.totalRevenue), icon: 'payments', color: 'gold' as const },
      { title: 'Total Orders', value: data.totalOrders, icon: 'shopping_bag', color: 'blue' as const },
      { title: 'Pending Orders', value: data.pendingOrders, icon: 'schedule', color: 'gold' as const },
      { title: 'Total Users', value: data.totalUsers, icon: 'group', color: 'green' as const },
      {
        title: 'Low Stock Products',
        value: data.lowStockProducts,
        icon: 'inventory_2',
        color: data.lowStockProducts > 0 ? ('red' as const) : ('green' as const),
      },
    ];
  });

  protected readonly quickActions = computed(() => {
    const data = this.overview();
    if (!data) return [];

    return [
      {
        id: 'pending-testimonials',
        title: 'Pending Testimonials',
        description: `${data.pendingTestimonialsCount} testimonials waiting for review.`,
        icon: 'reviews',
        actionLabel: 'Review Now',
        route: '/dashboard/testimonials',
      },
      {
        id: 'low-stock',
        title: 'Low Stock',
        description: `${data.lowStockProducts} products need stock update.`,
        icon: 'inventory',
        actionLabel: 'View Products',
        route: '/dashboard/products',
      },
    ];
  });

  constructor() {
    this.fetchOverview();
  }

  protected fetchOverview(): void {
    this.loading.set(true);
    this.error.set(null);

    this.dashboardService.getOverview().subscribe({
      next: (response) => {
        this.overview.set(response.data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load dashboard overview.');
        this.loading.set(false);
      },
    });
  }

  protected onOrdersRowClick(row: Record<string, unknown>): void {
    const id = row['id'];
    if (typeof id === 'string' && id) {
      void this.router.navigate(['/dashboard/orders']);
    }
  }

  protected asStatus(value: unknown): DashboardStatus | null {
    if (typeof value !== 'string') return null;
    return value as DashboardStatus;
  }

  private formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  }

  private formatDate(value: string): string {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }
}

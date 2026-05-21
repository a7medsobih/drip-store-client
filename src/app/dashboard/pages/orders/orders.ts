import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  DashboardPageHeader,
  DashboardTable,
  DashboardTableSkeleton,
} from '@dashboard/components';
import { DashboardBadge } from '@dashboard/components/dashboard-badge/dashboard-badge';
import {
  DashboardTableColumn,
  Order,
  OrderStatus,
} from '@dashboard/models/dashboard.models';
import { OrdersService } from '@dashboard/services/orders.service';

const ORDER_STATUSES: OrderStatus[] = [
  'pending',
  'preparing',
  'shipped',
  'received',
  'cancelledByUser',
  'cancelledByAdmin',
  'refused',
];

@Component({
  selector: 'app-orders',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CurrencyPipe,
    DatePipe,
    DashboardBadge,
    DashboardPageHeader,
    DashboardTable,
    DashboardTableSkeleton,
    FormsModule,
  ],
  templateUrl: './orders.html',
})
export class Orders {
  private readonly ordersService = inject(OrdersService);

  protected readonly orderStatuses = ORDER_STATUSES;
  protected readonly orders = signal<Order[]>([]);
  protected readonly loading = signal(true);
  protected readonly currentPage = signal(1);
  protected readonly totalItems = signal(0);
  protected readonly totalPages = signal(1);
  protected readonly pageSize = signal(20);
  protected readonly error = signal<string | null>(null);
  protected readonly toast = signal<string | null>(null);
  protected readonly loadingDetails = signal(false);
  protected readonly savingStatus = signal(false);
  protected readonly selectedOrder = signal<Order | null>(null);
  protected readonly modalStatus = signal<OrderStatus | ''>('');
  protected readonly filters = signal({
    status: '',
    from: '',
    to: '',
    search: '',
  });

  protected readonly columns: DashboardTableColumn[] = [
    { key: 'orderId', label: 'Order ID', width: '14%' },
    { key: 'customer', label: 'Customer', width: '18%' },
    { key: 'phone', label: 'Phone', width: '14%' },
    { key: 'total', label: 'Total', width: '12%', align: 'right' },
    { key: 'status', label: 'Status', width: '14%' },
    { key: 'date', label: 'Date', width: '14%' },
    { key: 'actions', label: 'Actions', width: '14%', align: 'right' },
  ];

  protected readonly tableRows = computed(() =>
    this.orders().map((order) => ({
      _id: order._id,
      orderId: this.shortId(order._id),
      customer: order.userName,
      phone: order.phoneNumber,
      total: this.formatCurrency(order.totalPrice),
      status: order.status,
      date: this.formatDate(order.createdAt),
      actions: order._id,
    })),
  );

  constructor() {
    this.fetchOrders();
  }

  protected fetchOrders(): void {
    this.loading.set(true);
    this.error.set(null);

    const filters = this.filters();
    this.ordersService
      .getOrders({
        page: this.currentPage(),
        limit: this.pageSize(),
        status: filters.status || undefined,
        from: filters.from || undefined,
        to: filters.to || undefined,
        search: filters.search.trim() || undefined,
      })
      .subscribe({
        next: (response) => {
          const items = response.data.items ?? [];
          const pagination = response.data.pagination;
          this.orders.set(items);
          this.totalItems.set(pagination?.total ?? items.length);
          this.currentPage.set(pagination?.page ?? this.currentPage());
          this.totalPages.set(pagination?.totalPages ?? 1);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Unable to load orders.');
          this.loading.set(false);
        },
      });
  }

  protected applyFilters(): void {
    this.currentPage.set(1);
    this.fetchOrders();
  }

  protected nextPage(): void {
    if (this.currentPage() >= this.totalPages()) return;
    this.currentPage.update((value) => value + 1);
    this.fetchOrders();
  }

  protected previousPage(): void {
    if (this.currentPage() <= 1) return;
    this.currentPage.update((value) => value - 1);
    this.fetchOrders();
  }

  protected viewOrder(order: Order, event: Event): void {
    event.stopPropagation();
    this.loadingDetails.set(true);
    this.selectedOrder.set(order);
    this.modalStatus.set(order.status);

    this.ordersService.getOrderById(order._id).subscribe({
      next: (response) => {
        this.selectedOrder.set(response.data);
        this.modalStatus.set(response.data.status);
        this.loadingDetails.set(false);
      },
      error: () => {
        this.loadingDetails.set(false);
        this.showToast('Unable to load order details.');
      },
    });
  }

  protected closeModal(): void {
    if (this.savingStatus()) return;
    this.selectedOrder.set(null);
    this.modalStatus.set('');
  }

  protected onInlineStatusChange(order: Order, event: Event): void {
    const select = event.target as HTMLSelectElement;
    const nextStatus = select.value as OrderStatus;
    if (nextStatus === order.status) return;

    const confirmed = window.confirm(`تأكيد تغيير الحالة إلى ${nextStatus}؟`);
    if (!confirmed) {
      select.value = order.status;
      return;
    }

    this.applyStatusUpdate(order._id, nextStatus, order.status);
  }

  protected saveModalStatus(): void {
    const order = this.selectedOrder();
    const nextStatus = this.modalStatus();
    if (!order || !nextStatus || nextStatus === order.status) return;

    const confirmed = window.confirm(`تأكيد تغيير الحالة إلى ${nextStatus}؟`);
    if (!confirmed) return;

    this.savingStatus.set(true);
    this.applyStatusUpdate(order._id, nextStatus, order.status, () => {
      this.savingStatus.set(false);
    });
  }

  protected lineTotal(item: { price: number; quantity: number }): string {
    return this.formatCurrency(item.price * item.quantity);
  }

  protected statusLabel(status: string): string {
    return status.replace(/([A-Z])/g, ' $1').trim();
  }

  protected asOrder(row: Record<string, unknown>): Order | null {
    const id = row['_id'];
    if (typeof id !== 'string') return null;
    return this.orders().find((item) => item._id === id) ?? null;
  }

  private applyStatusUpdate(
    orderId: string,
    nextStatus: OrderStatus,
    previousStatus: OrderStatus,
    onComplete?: () => void,
  ): void {
    this.patchOrderStatus(orderId, nextStatus);

    this.ordersService.updateStatus(orderId, nextStatus).subscribe({
      next: (response) => {
        this.patchOrderStatus(orderId, response.data.status);
        const selected = this.selectedOrder();
        if (selected?._id === orderId) {
          this.selectedOrder.set({ ...selected, status: response.data.status });
          this.modalStatus.set(response.data.status);
        }
        this.showToast('Order status updated.');
        onComplete?.();
      },
      error: () => {
        this.patchOrderStatus(orderId, previousStatus);
        const selected = this.selectedOrder();
        if (selected?._id === orderId) {
          this.selectedOrder.set({ ...selected, status: previousStatus });
          this.modalStatus.set(previousStatus);
        }
        this.showToast('Failed to update order status.');
        onComplete?.();
      },
    });
  }

  private patchOrderStatus(orderId: string, status: OrderStatus): void {
    this.orders.update((list) =>
      list.map((item) => (item._id === orderId ? { ...item, status } : item)),
    );
  }

  private showToast(message: string): void {
    this.toast.set(message);
    setTimeout(() => this.toast.set(null), 2600);
  }

  private shortId(id: string): string {
    return id.length > 8 ? `#${id.slice(-8)}` : `#${id}`;
  }

  private formatDate(value: string): string {
    if (!value) return '-';
    return new Intl.DateTimeFormat('en-GB', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(value));
  }

  private formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  }
}

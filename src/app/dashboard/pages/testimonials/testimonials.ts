import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  DashboardPageHeader,
  DashboardTable,
  DashboardTableSkeleton,
} from '@dashboard/components';
import { DashboardBadge } from '@dashboard/components/dashboard-badge/dashboard-badge';
import {
  AdminTestimonial,
  DashboardTableColumn,
  TestimonialStatus,
} from '@dashboard/models/dashboard.models';
import { TestimonialsService } from '@dashboard/services/testimonials.service';
import { RatingStars } from '@shared/components/rating-stars/rating-stars';

type StatusFilter = '' | TestimonialStatus;

const STATUS_TABS: { label: string; value: StatusFilter }[] = [
  { label: 'All', value: '' },
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Refused', value: 'refused' },
];

@Component({
  selector: 'app-testimonials',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DashboardBadge,
    DashboardPageHeader,
    DashboardTable,
    DashboardTableSkeleton,
    FormsModule,
    RatingStars,
  ],
  templateUrl: './testimonials.html',
})
export class Testimonials {
  private readonly testimonialsService = inject(TestimonialsService);

  protected readonly statusTabs = STATUS_TABS;
  protected readonly starOptions = [1, 2, 3, 4, 5];
  protected readonly testimonials = signal<AdminTestimonial[]>([]);
  protected readonly loading = signal(true);
  protected readonly filters = signal({
    status: 'pending' as StatusFilter,
    stars: '',
    from: '',
    to: '',
  });
  protected readonly currentPage = signal(1);
  protected readonly totalItems = signal(0);
  protected readonly totalPages = signal(1);
  protected readonly pageSize = signal(20);
  protected readonly error = signal<string | null>(null);
  protected readonly toast = signal<string | null>(null);
  protected readonly updatingId = signal<string | null>(null);
  protected readonly selectedTestimonial = signal<AdminTestimonial | null>(null);

  protected readonly columns: DashboardTableColumn[] = [
    { key: 'user', label: 'User', width: '16%' },
    { key: 'stars', label: 'Stars', width: '14%' },
    { key: 'comment', label: 'Comment', width: '30%' },
    { key: 'status', label: 'Status', width: '12%' },
    { key: 'date', label: 'Date', width: '14%' },
    { key: 'actions', label: 'Actions', width: '14%', align: 'right' },
  ];

  protected readonly tableRows = computed(() =>
    this.testimonials().map((item) => ({
      _id: item._id,
      user: item.userName,
      stars: item.stars,
      comment: this.truncateComment(item.comment),
      status: item.status,
      date: this.formatDate(item.createdAt),
      actions: item._id,
    })),
  );

  constructor() {
    this.fetchTestimonials();
  }

  protected fetchTestimonials(): void {
    this.loading.set(true);
    this.error.set(null);

    const filters = this.filters();
    this.testimonialsService
      .getTestimonials({
        page: this.currentPage(),
        limit: this.pageSize(),
        status: filters.status || undefined,
        stars: filters.stars || undefined,
        from: filters.from || undefined,
        to: filters.to || undefined,
      })
      .subscribe({
        next: (response) => {
          const normalized = this.normalizeListResponse(response.data);
          this.testimonials.set(normalized.testimonials);
          this.totalItems.set(normalized.total);
          this.currentPage.set(normalized.page);
          this.totalPages.set(
            Math.max(1, Math.ceil(normalized.total / this.pageSize())),
          );
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set(this.resolveLoadError(err, 'testimonials'));
          this.loading.set(false);
        },
      });
  }

  protected setStatusFilter(status: StatusFilter): void {
    this.filters.update((value) => ({ ...value, status }));
    this.currentPage.set(1);
    this.fetchTestimonials();
  }

  protected applyFilters(): void {
    this.currentPage.set(1);
    this.fetchTestimonials();
  }

  protected nextPage(): void {
    if (this.currentPage() >= this.totalPages()) return;
    this.currentPage.update((value) => value + 1);
    this.fetchTestimonials();
  }

  protected previousPage(): void {
    if (this.currentPage() <= 1) return;
    this.currentPage.update((value) => value - 1);
    this.fetchTestimonials();
  }

  protected openCommentModal(testimonial: AdminTestimonial, event: Event): void {
    event.stopPropagation();
    this.selectedTestimonial.set(testimonial);
  }

  protected closeModal(): void {
    if (this.updatingId()) return;
    this.selectedTestimonial.set(null);
  }

  protected approve(testimonial: AdminTestimonial, event: Event): void {
    event.stopPropagation();
    this.updateStatus(testimonial._id, 'approved');
  }

  protected refuse(testimonial: AdminTestimonial, event: Event): void {
    event.stopPropagation();
    this.updateStatus(testimonial._id, 'refused');
  }

  protected canApprove(status: TestimonialStatus): boolean {
    return status === 'pending' || status === 'refused';
  }

  protected canRefuse(status: TestimonialStatus): boolean {
    return status === 'pending' || status === 'approved';
  }

  protected starsArray(value: unknown): number[] {
    const parsed = Number(value);
    const count = Math.min(5, Math.max(0, Math.round(Number.isNaN(parsed) ? 0 : parsed)));
    return Array.from({ length: count }, (_, index) => index + 1);
  }

  protected asTestimonial(row: Record<string, unknown>): AdminTestimonial | null {
    const id = row['_id'];
    if (typeof id !== 'string') return null;
    return this.testimonials().find((item) => item._id === id) ?? null;
  }

  protected truncateComment(value: string, max = 60): string {
    if (!value) return '-';
    if (value.length <= max) return value;
    return `${value.slice(0, max).trimEnd()}…`;
  }

  private updateStatus(
    id: string,
    status: Extract<TestimonialStatus, 'approved' | 'refused'>,
  ): void {
    if (this.updatingId() === id) return;

    const previous = this.testimonials().find((item) => item._id === id);
    if (!previous) return;

    this.updatingId.set(id);
    this.patchTestimonialStatus(id, status);

    this.testimonialsService.updateStatus(id, status).subscribe({
      next: (response) => {
        const nextStatus = (response.data?.status ?? status) as TestimonialStatus;
        this.patchTestimonialStatus(id, nextStatus);
        this.syncSelectedTestimonial(id, nextStatus);
        this.updatingId.set(null);
        this.showToast(status === 'approved' ? 'Testimonial approved.' : 'Testimonial refused.');
      },
      error: () => {
        this.patchTestimonialStatus(id, previous.status);
        this.syncSelectedTestimonial(id, previous.status);
        this.updatingId.set(null);
        this.showToast('Failed to update testimonial status.');
      },
    });
  }

  private patchTestimonialStatus(id: string, status: TestimonialStatus): void {
    this.testimonials.update((list) =>
      list.map((item) => (item._id === id ? { ...item, status } : item)),
    );
  }

  private syncSelectedTestimonial(id: string, status: TestimonialStatus): void {
    const selected = this.selectedTestimonial();
    if (selected?._id === id) {
      this.selectedTestimonial.set({ ...selected, status });
    }
  }

  private showToast(message: string): void {
    this.toast.set(message);
    setTimeout(() => this.toast.set(null), 2600);
  }

  private formatDate(value: string): string {
    if (!value) return '-';
    return new Intl.DateTimeFormat('en-GB', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(value));
  }

  private resolveLoadError(error: unknown, resource: string): string {
    if (error instanceof HttpErrorResponse) {
      const body = error.error as { message?: string } | string | null;
      const message =
        typeof body === 'object' && body && 'message' in body && body.message
          ? body.message
          : typeof body === 'string' && body.trim()
            ? body.trim()
            : error.statusText || 'Request failed';
      return `Failed to load ${resource} (${error.status}): ${message}`;
    }

    if (error instanceof Error && error.message) {
      return `Failed to load ${resource}: ${error.message}`;
    }

    return `Failed to load ${resource}.`;
  }

  private normalizeListResponse(data: unknown): {
    testimonials: AdminTestimonial[];
    total: number;
    page: number;
  } {
    const payload = (data ?? {}) as Record<string, unknown>;
    const rawItems = (payload['testimonials'] ?? payload['items'] ?? []) as Record<
      string,
      unknown
    >[];
    const pagination = payload['pagination'] as
      | { total?: number; page?: number }
      | undefined;

    return {
      testimonials: rawItems.map((item) => this.normalizeTestimonial(item)),
      total: Number(payload['total'] ?? pagination?.total ?? rawItems.length),
      page: Number(payload['page'] ?? pagination?.page ?? 1),
    };
  }

  private normalizeTestimonial(item: Record<string, unknown>): AdminTestimonial {
    const userRef = item['userId'];
    let userId = '';
    let userName = String(item['userName'] ?? '');

    if (typeof userRef === 'string') {
      userId = userRef;
    } else if (userRef && typeof userRef === 'object') {
      const user = userRef as Record<string, unknown>;
      userId = String(user['_id'] ?? '');
      userName = userName || String(user['name'] ?? '');
    }

    const comment = String(item['comment'] ?? item['message'] ?? '');
    const stars = Number(item['stars'] ?? item['rating'] ?? 0);

    return {
      _id: String(item['_id'] ?? ''),
      userId,
      userName: userName || 'Unknown user',
      comment,
      stars: Number.isNaN(stars) ? 0 : stars,
      status: (item['status'] as TestimonialStatus) ?? 'pending',
      createdAt: String(item['createdAt'] ?? ''),
    };
  }
}

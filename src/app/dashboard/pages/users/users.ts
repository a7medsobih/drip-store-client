import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
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
import { DashboardTableColumn, User } from '@dashboard/models/dashboard.models';
import { UsersService } from '@dashboard/services/users.service';

@Component({
  selector: 'app-users',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DashboardBadge,
    DashboardPageHeader,
    DashboardTable,
    DashboardTableSkeleton,
    FormsModule,
  ],
  templateUrl: './users.html',
})
export class Users {
  private readonly usersService = inject(UsersService);

  protected readonly users = signal<User[]>([]);
  protected readonly loading = signal(true);
  protected readonly currentPage = signal(1);
  protected readonly search = signal('');
  protected readonly totalItems = signal(0);
  protected readonly totalPages = signal(1);
  protected readonly pageSize = signal(20);
  protected readonly error = signal<string | null>(null);
  protected readonly toast = signal<string | null>(null);
  protected readonly togglingId = signal<string | null>(null);

  protected readonly columns: DashboardTableColumn[] = [
    { key: 'name', label: 'Name', width: '18%' },
    { key: 'mobile', label: 'Mobile', width: '14%' },
    { key: 'email', label: 'Email', width: '22%' },
    { key: 'gender', label: 'Gender', width: '10%' },
    { key: 'status', label: 'Status', width: '12%' },
    { key: 'joined', label: 'Joined', width: '14%' },
    { key: 'actions', label: 'Actions', width: '10%', align: 'right' },
  ];

  protected readonly tableRows = computed(() =>
    this.users().map((user) => ({
      _id: user._id,
      name: user.name,
      mobile: user.mobile || '-',
      email: user.email || '-',
      gender: this.formatGender(user.gender),
      status: user.isActive ? 'active' : 'inactive',
      joined: this.formatDate(user.createdAt),
      actions: user._id,
    })),
  );

  constructor() {
    this.fetchUsers();

    let skipSearchDebounce = true;
    effect((onCleanup) => {
      this.search();
      if (skipSearchDebounce) {
        skipSearchDebounce = false;
        return;
      }
      const timer = setTimeout(() => {
        if (this.currentPage() !== 1) {
          this.currentPage.set(1);
        }
        this.fetchUsers();
      }, 300);
      onCleanup(() => clearTimeout(timer));
    });
  }

  protected fetchUsers(): void {
    this.loading.set(true);
    this.error.set(null);

    this.usersService
      .getUsers({
        page: this.currentPage(),
        limit: this.pageSize(),
        search: this.search().trim() || undefined,
      })
      .subscribe({
        next: (response) => {
          const normalized = this.normalizeListResponse(response.data);
          this.users.set(normalized.users);
          this.totalItems.set(normalized.total);
          this.currentPage.set(normalized.page);
          this.totalPages.set(
            Math.max(1, Math.ceil(normalized.total / this.pageSize())),
          );
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set(this.resolveLoadError(err, 'users'));
          this.loading.set(false);
        },
      });
  }

  protected toggleActive(user: User, event: Event): void {
    event.stopPropagation();
    if (this.togglingId() === user._id) return;

    const previousActive = user.isActive;
    this.togglingId.set(user._id);
    this.patchUserActive(user._id, !previousActive);

    this.usersService.toggleActive(user._id).subscribe({
      next: (response) => {
        const nextActive = response.data?.isActive ?? !previousActive;
        this.patchUserActive(user._id, nextActive);
        this.togglingId.set(null);
        this.showToast(nextActive ? 'User activated.' : 'User deactivated.');
      },
      error: () => {
        this.patchUserActive(user._id, previousActive);
        this.togglingId.set(null);
        this.showToast('Failed to update user status.');
      },
    });
  }

  protected nextPage(): void {
    if (this.currentPage() >= this.totalPages()) return;
    this.currentPage.update((value) => value + 1);
    this.fetchUsers();
  }

  protected previousPage(): void {
    if (this.currentPage() <= 1) return;
    this.currentPage.update((value) => value - 1);
    this.fetchUsers();
  }

  protected asUser(row: Record<string, unknown>): User | null {
    const id = row['_id'];
    if (typeof id !== 'string') return null;
    return this.users().find((item) => item._id === id) ?? null;
  }

  private patchUserActive(userId: string, isActive: boolean): void {
    this.users.update((list) =>
      list.map((item) => (item._id === userId ? { ...item, isActive } : item)),
    );
  }

  private showToast(message: string): void {
    this.toast.set(message);
    setTimeout(() => this.toast.set(null), 2600);
  }

  private formatGender(value: string): string {
    if (!value) return '-';
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  private formatDate(value: string): string {
    if (!value) return '-';
    return new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium' }).format(new Date(value));
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

  private normalizeListResponse(data: unknown): { users: User[]; total: number; page: number } {
    const payload = (data ?? {}) as Record<string, unknown>;
    const users = (payload['users'] ?? payload['items'] ?? []) as User[];
    const pagination = payload['pagination'] as
      | { total?: number; page?: number }
      | undefined;
    return {
      users,
      total: Number(payload['total'] ?? pagination?.total ?? users.length),
      page: Number(payload['page'] ?? pagination?.page ?? 1),
    };
  }
}

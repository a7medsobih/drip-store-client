import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { DashboardStatus, DashboardTone } from '@dashboard/models/dashboard.models';

@Component({
  selector: 'app-dashboard-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './dashboard-badge.html',
})
export class DashboardBadge {
  readonly label = input<string>('');
  readonly tone = input<DashboardTone>('neutral');
  readonly status = input<DashboardStatus | null>(null);

  protected readonly classes = computed(() => {
    const status = this.status();
    if (status) {
      return this.statusClasses(status);
    }

    const tone = this.tone();

    if (tone === 'primary') {
      return 'bg-primary/10 text-primary';
    }

    if (tone === 'secondary') {
      return 'bg-secondary-container text-on-secondary-container';
    }

    if (tone === 'danger') {
      return 'bg-error-container text-on-error-container';
    }

    return 'bg-surface-container text-on-surface-variant';
  });

  protected readonly displayLabel = computed(() => {
    if (this.label()) {
      return this.label();
    }

    const status = this.status();
    return status ? status : 'N/A';
  });

  private statusClasses(status: DashboardStatus): string {
    if (status === 'pending') return 'bg-amber-500/20 text-amber-300';
    if (status === 'preparing') return 'bg-sky-500/20 text-sky-300';
    if (status === 'shipped') return 'bg-teal-500/20 text-teal-300';
    if (status === 'received' || status === 'approved' || status === 'active') {
      return 'bg-emerald-500/20 text-emerald-300';
    }
    if (status === 'inactive') return 'bg-zinc-500/20 text-zinc-300';
    if (
      status === 'cancelledByUser' ||
      status === 'cancelledByAdmin' ||
      status === 'refused'
    ) {
      return 'bg-error-container text-on-error-container';
    }
    return 'bg-rose-500/20 text-rose-300';
  }
}

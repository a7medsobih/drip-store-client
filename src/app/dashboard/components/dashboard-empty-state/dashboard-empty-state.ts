import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { computed } from '@angular/core';
import { DashboardEmptyStateConfig } from '@dashboard/models/dashboard.models';

@Component({
  selector: 'app-dashboard-empty-state',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './dashboard-empty-state.html',
})
export class DashboardEmptyState {
  readonly config = input<DashboardEmptyStateConfig | null>(null);
  readonly message = input<string>('');
  readonly actionLabel = input<string>('');
  readonly actionClick = output<void>();

  protected readonly resolvedMessage = computed(
    () => this.config()?.description || this.message(),
  );
  protected readonly resolvedActionLabel = computed(
    () => this.config()?.actionLabel || this.actionLabel(),
  );
}

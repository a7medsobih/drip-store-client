import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DashboardAction } from '@dashboard/models/dashboard.models';

@Component({
  selector: 'app-dashboard-page-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './dashboard-page-header.html',
})
export class DashboardPageHeader {
  readonly title = input.required<string>();
  readonly subtitle = input<string>('');
  readonly description = input<string>('');
  readonly actionLabel = input<string>('');
  readonly actions = input<DashboardAction[]>([]);
  readonly actionClick = output<void>();

  protected readonly resolvedSubtitle = computed(() => this.subtitle() || this.description());
  protected readonly primaryAction = computed(() => this.actions()[0] ?? null);
}

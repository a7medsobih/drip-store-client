import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { DashboardQuickAction } from '@dashboard/models/dashboard.models';

@Component({
  selector: 'app-quick-action-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './quick-action-card.html',
})
export class QuickActionCard {
  readonly action = input.required<DashboardQuickAction>();
}

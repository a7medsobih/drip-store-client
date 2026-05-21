import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';

import { AuthService } from '@auth/auth.service';

@Component({
  selector: 'app-dashboard-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './dashboard-header.html',
  styleUrl: './dashboard-header.css',
})
export class DashboardHeader {
  private readonly authService = inject(AuthService);

  readonly pageTitle = input.required<string>();
  readonly menuClicked = output<void>();

  protected readonly adminName = computed(
    () => this.authService.currentUser()?.name?.trim() || 'Admin',
  );
}

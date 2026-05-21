import { ChangeDetectionStrategy, Component } from '@angular/core';

import { DashboardLayout } from '../dashboard-layout/dashboard-layout';

@Component({
  selector: 'app-dashboard-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DashboardLayout],
  templateUrl: './dashboard-shell.html',
  styleUrl: './dashboard-shell.css',
})
export class DashboardShell {}

import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-dashboard-form-skeleton',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './dashboard-form-skeleton.html',
  styleUrl: './dashboard-form-skeleton.css',
})
export class DashboardFormSkeleton {}

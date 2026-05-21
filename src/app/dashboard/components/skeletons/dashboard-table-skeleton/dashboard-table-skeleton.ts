import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-dashboard-table-skeleton',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './dashboard-table-skeleton.html',
  styleUrl: './dashboard-table-skeleton.css',
})
export class DashboardTableSkeleton {
  readonly rows = input(4);

  protected readonly placeholderRows = computed(() =>
    Array.from({ length: this.rows() }, (_, index) => index),
  );
}

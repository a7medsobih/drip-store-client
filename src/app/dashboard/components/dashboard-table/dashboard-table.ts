import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  TemplateRef,
  input,
  output,
} from '@angular/core';

import { DashboardBadge } from '@dashboard/components/dashboard-badge/dashboard-badge';
import { DashboardEmptyState } from '@dashboard/components/dashboard-empty-state/dashboard-empty-state';
import { DashboardStatus, DashboardTableColumn } from '@dashboard/models/dashboard.models';
import { DashboardTableSkeleton } from '@dashboard/components/skeletons/dashboard-table-skeleton/dashboard-table-skeleton';

@Component({
  selector: 'app-dashboard-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DashboardBadge, DashboardEmptyState, DashboardTableSkeleton, NgTemplateOutlet],
  templateUrl: './dashboard-table.html',
  styleUrl: './dashboard-table.css',
})
export class DashboardTable {
  readonly columns = input.required<DashboardTableColumn[]>();
  readonly rows = input.required<Record<string, unknown>[]>();
  readonly loading = input(false);
  readonly emptyMessage = input('No data available.');
  readonly cellTemplate = input<TemplateRef<unknown> | null>(null);
  readonly rowClick = output<Record<string, unknown>>();
  @Input() emptyState: { description?: string } | null = null;

  protected columnClass(column: DashboardTableColumn): string {
    return column.align === 'right' ? 'text-right' : 'text-left';
  }

  protected asStatus(value: unknown): DashboardStatus | null {
    if (typeof value !== 'string') {
      return null;
    }
    return value as DashboardStatus;
  }

  protected emitRowClick(row: Record<string, unknown>): void {
    this.rowClick.emit(row);
  }

  protected resolvedEmptyMessage(): string {
    return this.emptyState?.description || this.emptyMessage();
  }
}

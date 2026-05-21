import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { DashboardStat } from '@dashboard/models/dashboard.models';

@Component({
  selector: 'app-stat-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './stat-card.html',
  styleUrl: './stat-card.css',
})
export class StatCard {
  readonly stat = input<DashboardStat | null>(null);
  readonly title = input<string>('');
  readonly value = input<number | string>('');
  readonly icon = input<string>('insights');
  readonly trend = input<{ value: number; direction: 'up' | 'down' }>();
  readonly color = input<'gold' | 'blue' | 'green' | 'red'>('gold');

  protected readonly accentClasses = computed(() => {
    const color = this.color();

    if (color === 'blue') {
      return {
        border: 'border-sky-500/40',
        icon: 'text-sky-300',
        value: 'text-sky-100',
        trend: 'text-sky-300',
      };
    }

    if (color === 'green') {
      return {
        border: 'border-emerald-500/40',
        icon: 'text-emerald-300',
        value: 'text-emerald-100',
        trend: 'text-emerald-300',
      };
    }

    if (color === 'red') {
      return {
        border: 'border-rose-500/40',
        icon: 'text-rose-300',
        value: 'text-rose-100',
        trend: 'text-rose-300',
      };
    }

    return {
      border: 'border-[#C8A96E]/40',
      icon: 'text-[#C8A96E]',
      value: 'text-[#E8D3A8]',
      trend: 'text-[#C8A96E]',
    };
  });

  protected readonly resolvedTitle = computed(() => this.stat()?.label ?? this.title());
  protected readonly resolvedValue = computed(() => this.stat()?.value ?? this.value());
  protected readonly resolvedIcon = computed(() => this.stat()?.icon ?? this.icon());
}

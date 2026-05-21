import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-section-header',
  templateUrl: './section-header.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
  },
})
export class SectionHeader {
  readonly eyebrow = input<string>();
  readonly title = input.required<string>();
  readonly description = input<string>();
  readonly actionLabel = input<string>();
  readonly actionHref = input<string>();
  readonly align = input<'left' | 'center'>('left');
  readonly titleSize = input<'md' | 'lg'>('md');

  protected readonly wrapperClass = computed(() =>
    this.align() === 'center'
      ? 'flex flex-col items-center text-center'
      : 'flex items-end justify-between gap-md',
  );

  protected readonly descriptionClass = computed(
    () => 'font-body-md text-body-md text-on-surface-variant',
  );

  protected readonly titleClass = computed(() =>
    this.titleSize() === 'lg'
      ? 'font-display-lg text-display-lg text-on-surface'
      : 'font-display-md text-display-md text-on-surface',
  );
}

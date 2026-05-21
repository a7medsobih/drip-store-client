import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  template:
    '<button [type]="type()" [class]="buttonClass()" [attr.aria-label]="ariaLabel() || null"><ng-content /></button>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Button {
  readonly variant = input<'primary' | 'ghost' | 'outline'>('primary');
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly ariaLabel = input<string>();

  protected readonly buttonClass = computed(() => {
    const variants = {
      primary: 'home-btn home-btn--primary',
      ghost: 'home-btn home-btn--ghost',
      outline: 'home-btn home-btn--outline',
    } as const;

    return variants[this.variant()];
  });
}

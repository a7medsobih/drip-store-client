import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-rating-stars',
  templateUrl: './rating-stars.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'mb-md flex items-center gap-sm text-primary',
  },
})
export class RatingStars {
  readonly stars = input.required<ReadonlyArray<number>>();
}

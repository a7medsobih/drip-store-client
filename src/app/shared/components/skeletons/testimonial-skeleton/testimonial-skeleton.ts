import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-testimonial-skeleton',
  templateUrl: './testimonial-skeleton.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestimonialSkeleton {
  protected readonly starPlaceholders = [0, 1, 2, 3, 4];
}

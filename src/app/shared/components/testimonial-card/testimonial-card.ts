import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { TestimonialCardModel } from '@core/models/testimonial.model';

import { RatingStars } from '../rating-stars/rating-stars';

@Component({
  selector: 'app-testimonial-card',
  imports: [RatingStars],
  templateUrl: './testimonial-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestimonialCard {
  readonly testimonial = input.required<TestimonialCardModel>();
}

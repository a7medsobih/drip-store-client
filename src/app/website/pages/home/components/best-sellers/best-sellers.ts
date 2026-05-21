import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { HomeBestSellersSectionModel } from '@core/models/home.model';
import { Button } from '@shared/components/button/button';

@Component({
  selector: 'app-best-sellers',
  imports: [Button],
  templateUrl: './best-sellers.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BestSellers {
  readonly section = input.required<HomeBestSellersSectionModel>();
}

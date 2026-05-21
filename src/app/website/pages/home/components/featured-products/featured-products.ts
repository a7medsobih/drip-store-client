import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { HomeFeaturedProductsSectionModel } from '@core/models/home.model';
import { SectionHeader } from '@shared/components/section-header/section-header';

import { environment } from '../../../../../../environments/env-development';

@Component({
  selector: 'app-featured-products',
  imports: [SectionHeader],
  templateUrl: './featured-products.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeaturedProducts {
  protected readonly environment = environment;
  readonly section = input.required<HomeFeaturedProductsSectionModel>();
}

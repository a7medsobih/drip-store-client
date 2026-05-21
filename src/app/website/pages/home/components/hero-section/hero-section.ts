import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { HomeHeroModel } from '@core/models/home.model';
import { Button } from '@shared/components/button/button';

@Component({
  selector: 'app-hero-section',
  imports: [Button],
  templateUrl: './hero-section.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroSection {
  readonly hero = input.required<HomeHeroModel>();
}

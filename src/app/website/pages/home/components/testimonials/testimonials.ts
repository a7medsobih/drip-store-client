import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { HomeTestimonialsSectionModel } from '@core/models/home.model';
import { Testimonial, TestimonialCardModel } from '@core/models/testimonial.model';
import { TestimonialService } from '@core/services/testimonial.service';
import { SectionHeader } from '@shared/components/section-header/section-header';
import { TestimonialSkeleton } from '@shared/components/skeletons/testimonial-skeleton/testimonial-skeleton';
import { TestimonialCard } from '@shared/components/testimonial-card/testimonial-card';

@Component({
  selector: 'app-testimonials',
  imports: [SectionHeader, TestimonialCard, TestimonialSkeleton],
  templateUrl: './testimonials.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Testimonials {
  private readonly testimonialService = inject(TestimonialService);
  private readonly destroyRef = inject(DestroyRef);

  readonly section = input.required<HomeTestimonialsSectionModel>();

  protected readonly testimonials = signal<Testimonial[]>([]);
  protected readonly isLoading = signal(true);
  protected readonly skeletonCards = [0, 1, 2];

  protected readonly testimonialsView = computed<TestimonialCardModel[]>(() =>
    this.testimonials().map((item) => ({
      id: item._id,
      quote: item.message,
      authorName: item.userId.name,
      authorLocation: 'Verified Customer',
      stars: Array.from({ length: Math.max(0, Math.floor(item.rating)) }, () => 0),
    })),
  );

  protected readonly shouldRenderSection = computed(
    () => this.isLoading() || this.testimonialsView().length > 0,
  );

  constructor() {
    this.loadTestimonials();
  }

  private loadTestimonials(): void {
    this.isLoading.set(true);

    this.testimonialService
      .getPublicTestimonials()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (testimonials) => {
          this.testimonials.set(testimonials);
          this.isLoading.set(false);
        },
        error: () => {
          this.testimonials.set([]);
          this.isLoading.set(false);
        },
      });
  }
}

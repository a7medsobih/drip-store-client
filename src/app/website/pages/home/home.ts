import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of, startWith } from 'rxjs';

import { ProductService } from '@app/core/services/product.service';
import {
  HOME_BEST_SELLERS_CONTENT,
  HOME_FEATURED_PRODUCTS_HEADER,
  HOME_HERO_CONTENT,
  HOME_TESTIMONIALS_SECTION,
} from '@core/constants/home.constants';
import {
  HomeBestSellersSectionModel,
  HomeFeaturedProductsSectionModel,
} from '@core/models/home.model';
import { Spinner } from '@shared/components/spinner/spinner';

import { Product } from '../../../core/models/product.model';
import { environment } from '../../../../environments/env-development';
import { BestSellers } from './components/best-sellers/best-sellers';
import { FeaturedProducts } from './components/featured-products/featured-products';
import { HeroSection } from './components/hero-section/hero-section';
import { Testimonials } from './components/testimonials/testimonials';

interface ProductRequestState {
  products: Product[];
  isLoading: boolean;
}

@Component({
  selector: 'app-home',
  imports: [HeroSection, FeaturedProducts, BestSellers, Testimonials, Spinner],
  templateUrl: './home.html',
  styleUrl: './home.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  private readonly productService = inject(ProductService);
  protected readonly environment = environment;
  protected readonly hero = HOME_HERO_CONTENT;
  protected readonly testimonialsSection = HOME_TESTIMONIALS_SECTION;

  private readonly initialProductsState: ProductRequestState = {
    products: [],
    isLoading: true,
  };

  private readonly newArrivalsState = toSignal(
    this.productService.getNewArrivals().pipe(
      map(
        (products): ProductRequestState => ({
          products,
          isLoading: false,
        }),
      ),
      startWith(this.initialProductsState),
      catchError(() =>
        of<ProductRequestState>({
          products: [],
          isLoading: false,
        }),
      ),
    ),
    { initialValue: this.initialProductsState },
  );

  private readonly bestSellersState = toSignal(
    this.productService.getBestSellers().pipe(
      map(
        (products): ProductRequestState => ({
          products,
          isLoading: false,
        }),
      ),
      startWith(this.initialProductsState),
      catchError(() =>
        of<ProductRequestState>({
          products: [],
          isLoading: false,
        }),
      ),
    ),
    { initialValue: this.initialProductsState },
  );

  private readonly newArrivals = computed(() => this.newArrivalsState().products);
  private readonly bestSellers = computed(() => this.bestSellersState().products);

  protected readonly isFeaturedProductsLoading = computed(
    () => this.newArrivalsState().isLoading,
  );
  protected readonly isBestSellersLoading = computed(
    () => this.bestSellersState().isLoading,
  );

  protected readonly featuredSection = computed<HomeFeaturedProductsSectionModel>(() => ({
    header: HOME_FEATURED_PRODUCTS_HEADER,
    products: this.newArrivals(),
  }));

  protected readonly bestSellersSection = computed<HomeBestSellersSectionModel>(() => ({
    ...HOME_BEST_SELLERS_CONTENT,
    images: this.bestSellers()
      .slice(0, 4)
      .map((product, index) => ({
        imageUrl: `${this.environment.baseURL}${product.image}`,
        imageAlt: product.name,
        isOffset: index % 2 !== 0,
      })),
  }));
}

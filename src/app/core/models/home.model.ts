import { Product } from './product.model';

export interface HomeSectionHeaderModel {
  eyebrow?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
}

export interface HomeHeroModel {
  imageUrl: string;
  imageAlt: string;
  title: string;
  description: string;
  primaryActionLabel: string;
  secondaryActionLabel: string;
}

export interface HomeFeaturedProductsSectionModel {
  header: HomeSectionHeaderModel;
  products: Product[];
}

export interface HomeBestSellerImageModel {
  imageUrl: string;
  imageAlt: string;
  isOffset?: boolean;
}

export interface HomeBestSellersContentModel {
  eyebrow: string;
  title: string;
  description: string;
  actionLabel: string;
}

export interface HomeBestSellersSectionModel extends HomeBestSellersContentModel {
  images: HomeBestSellerImageModel[];
}

export interface HomeTestimonialsSectionModel {
  header: HomeSectionHeaderModel;
}

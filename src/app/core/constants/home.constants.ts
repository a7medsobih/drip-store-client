import {
  HomeBestSellersContentModel,
  HomeHeroModel,
  HomeSectionHeaderModel,
  HomeTestimonialsSectionModel,
} from '@core/models/home.model';

export const HOME_HERO_CONTENT: HomeHeroModel = {
  imageUrl:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDj_Gm-XV5y0lEDKfUDoN84IWKWf29ie2y77_HNJCkG2TBcci7qBf4n5yjfIXS6uzAqA2ShnMNDm8Ia3yW8dTAKlKjBdmm1w7Xo_4TMTqpMwE5GxHNWFeH2yN0btVzYZtmqlB2ypZt60xazrdjqk3XOw1axs1rJbanoLSspANZRtqDgrci4X50RGdEYj06C67rwcoJRlail7G4-db-QygW2Fs0TNQFXNuSrgRyPt80_f1OIXnDNN9HFUPeQN-2mVmYOsw63i1QJ1UY',
  imageAlt:
    'A high-end editorial fashion shot featuring a model in minimalist, neutral-toned linen clothing standing against a soft-focus architectural backdrop. The lighting is bright and ethereal, emphasizing high-key tones and a serene, premium atmosphere. The color palette consists of soft beiges, warm whites, and subtle taupes, creating a sophisticated and breathable visual style that feels architectural and luxurious.',
  title: 'Essential Luxury',
  description:
    'Curated minimalist essentials designed for the modern architect of style. Breathing space for your wardrobe.',
  primaryActionLabel: 'Shop Collection',
  secondaryActionLabel: 'Our Story',
};

export const HOME_FEATURED_PRODUCTS_HEADER: HomeSectionHeaderModel = {
  eyebrow: 'Just Dropped',
  title: 'New Arrivals',
  actionLabel: 'View All',
  actionHref: '/products',
};

export const HOME_BEST_SELLERS_CONTENT: HomeBestSellersContentModel = {
  eyebrow: 'Best Sellers',
  title: 'Customer Favourites',
  description: 'The pieces everyone is talking about.',
  actionLabel: 'Shop Now',
};

export const HOME_TESTIMONIALS_SECTION: HomeTestimonialsSectionModel = {
  header: {
    title: 'The Inner Circle',
    description: 'Voices from our global community of minimalist connoisseurs.',
  },
};

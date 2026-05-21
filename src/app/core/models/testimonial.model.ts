export interface TestimonialUser {
  _id: string;
  name: string;
}

export interface Testimonial {
  _id: string;
  userId: TestimonialUser;
  message: string;
  rating: number;
  status: 'approved';
  createdAt: string;
  updatedAt: string;
}

export interface TestimonialCardModel {
  id: string;
  quote: string;
  authorName: string;
  authorLocation: string;
  stars: number[];
}

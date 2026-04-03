export interface Category {
  _id: string;
  title: string;
  slug: string;
  description?: string;
}

export interface MenuItem {
  _id: string;
  title: string;
  link?: string;
  isDropdown: boolean;
}

export interface GalleryImage {
  _id: string;
  title: string;
  slug: string;
  mainImage: MainImage;
  category: Category;
  description?: string;
  productInfo?: string;
  location?: string;
  iso: number;
  aperture: string;
  shutterSpeed: string;
}

export interface MainImage {
  _id: string;
  title: string;
  slug: string;
  image: string;
}

export interface HeroSlide {
  _id: string;
  heroImage: string; // pre-built URL string from the server
  buttonText: string;
  category: {
    title: string;
    slug: string;
    description?: string;
  };
}

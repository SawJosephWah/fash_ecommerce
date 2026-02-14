export interface ProductImage {
  id: number;
  url: string;
}

export interface Product {
  _id: string; // Changed from id: number to match MongoDB _id
  name: string;
  description: string;
  price: number;
  instock_count: number;
  category: string;
  sizes: string[]; // Changed from size to sizes to match your JSON
  colors: string[];
  images: ProductImage[];
  is_new_arrival: boolean;
  is_featured: boolean;
  rating_count: number;
  user: string; // The ID of the user who created it
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ProductCardProps {
  id: number,
  name: string;
  price: number;
  image: string;
  rating: number;
}

export interface FilterMetadataResponse {
  status: string;
  data: {
    colors: string[];
    sizes: string[];
    minPrice: number;
    maxPrice: number;
  };
}
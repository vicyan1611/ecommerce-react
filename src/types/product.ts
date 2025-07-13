export interface Category {
  id: number;
  name: string;
  description: string;
}

export interface ProductImage {
  id: number;
  image_url: string;
  alt_text?: string;
  is_thumbnail: boolean;
}

export interface Product {
  id: number;
  product_id: string;
  name: string;
  description?: string;
  price: number;
  inventory_count: number;
  category?: Category;
  images: ProductImage[];
  created_at: string;
  updated_at: string;
}

export interface ProductInput {
  name: string;
  description?: string;
  price: number;
  inventory_count: number;
  categoryId?: number;
}

// Helper function to get the primary image URL
export const getProductImageUrl = (product: Product): string => {
  const thumbnailImage = product.images?.find((img) => img.is_thumbnail);
  const firstImage = product.images?.[0];
  return (
    thumbnailImage?.image_url ||
    firstImage?.image_url ||
    "https://via.placeholder.com/300x300.png?text=No+Image"
  );
};

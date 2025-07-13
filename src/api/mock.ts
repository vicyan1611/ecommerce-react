import type {
  User,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
} from "../types/auth";

export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string; // Changed to string to match mock data
  description: string;
  inventory_count?: number; // Optional for mock API
  stock: number; // Keep for backward compatibility
  imageUrl: string; // Keep for backward compatibility
}

// Mock users database
const mockUsers: (User & { password: string })[] = [
  {
    id: "user1",
    email: "demo@example.com",
    name: "Demo User",
    password: "password123",
  },
];

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Quantum Laptop",
    price: 1299.99,
    imageUrl: "https://via.placeholder.com/300x300.png?text=Quantum+Laptop",
    category: "Electronics",
    description:
      "High-performance laptop with cutting-edge quantum processing technology",
    stock: 15,
  },
  {
    id: "2",
    name: "Celestial Smartwatch",
    price: 399.0,
    imageUrl: "https://via.placeholder.com/300x300.png?text=Celestial+Watch",
    category: "Wearables",
    description: "Advanced smartwatch with health monitoring and GPS tracking",
    stock: 32,
  },
  {
    id: "3",
    name: "Nova Headphones",
    price: 199.5,
    imageUrl: "https://via.placeholder.com/300x300.png?text=Nova+Headphones",
    category: "Audio",
    description: "Premium wireless headphones with noise cancellation",
    stock: 28,
  },
  {
    id: "4",
    name: "Fusion Keyboard",
    price: 89.99,
    imageUrl: "https://via.placeholder.com/300x300.png?text=Fusion+Keyboard",
    category: "Peripherals",
    description: "Mechanical keyboard with customizable RGB lighting",
    stock: 45,
  },
  {
    id: "5",
    name: "Stellar Monitor",
    price: 549.99,
    imageUrl: "https://via.placeholder.com/300x300.png?text=Stellar+Monitor",
    category: "Electronics",
    description: "4K gaming monitor with 144Hz refresh rate",
    stock: 12,
  },
  {
    id: "6",
    name: "Phoenix Mouse",
    price: 79.99,
    imageUrl: "https://via.placeholder.com/300x300.png?text=Phoenix+Mouse",
    category: "Peripherals",
    description: "Wireless gaming mouse with precision tracking",
    stock: 67,
  },
  {
    id: "7",
    name: "Aurora Earbuds",
    price: 129.99,
    imageUrl: "https://via.placeholder.com/300x300.png?text=Aurora+Earbuds",
    category: "Audio",
    description: "True wireless earbuds with spatial audio",
    stock: 89,
  },
  {
    id: "8",
    name: "Nexus Tablet",
    price: 799.99,
    imageUrl: "https://via.placeholder.com/300x300.png?text=Nexus+Tablet",
    category: "Electronics",
    description: "Professional tablet with stylus support",
    stock: 23,
  },
  {
    id: "9",
    name: "Zen Fitness Tracker",
    price: 199.99,
    imageUrl: "https://via.placeholder.com/300x300.png?text=Zen+Tracker",
    category: "Wearables",
    description: "Comprehensive fitness tracker with heart rate monitoring",
    stock: 54,
  },
  {
    id: "10",
    name: "Vortex Gaming Headset",
    price: 299.99,
    imageUrl: "https://via.placeholder.com/300x300.png?text=Vortex+Headset",
    category: "Audio",
    description: "Professional gaming headset with surround sound",
    stock: 19,
  },
];

// Simulate a network request
export const fetchFeaturedProducts = (): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockProducts.slice(0, 4)); // Return first 4 products as featured
    }, 500); // 500ms delay
  });
};

interface FetchProductsParams {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
}

// Simulate a network request for all products with filtering and sorting
export const fetchProducts = (
  params: FetchProductsParams = {}
): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredProducts = [...mockProducts];

      // Apply search filter
      if (params.search) {
        const searchTerm = params.search.toLowerCase();
        filteredProducts = filteredProducts.filter(
          (product) =>
            product.name.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm)
        );
      }

      // Apply category filter
      if (params.category) {
        filteredProducts = filteredProducts.filter(
          (product) => product.category === params.category
        );
      }

      // Apply price range filter
      if (params.minPrice !== undefined) {
        filteredProducts = filteredProducts.filter(
          (product) => product.price >= params.minPrice!
        );
      }
      if (params.maxPrice !== undefined) {
        filteredProducts = filteredProducts.filter(
          (product) => product.price <= params.maxPrice!
        );
      }

      // Apply sorting
      if (params.sort) {
        switch (params.sort) {
          case "name":
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
          case "name_desc":
            filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
            break;
          case "price_asc":
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
          case "price_desc":
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
          case "newest":
            // For demo purposes, reverse the order
            filteredProducts.reverse();
            break;
          case "oldest":
            // Keep original order
            break;
          default:
            break;
        }
      }

      resolve(filteredProducts);
    }, 300); // 300ms delay
  });
};

// Mock API functions for auth
export const login = (request: LoginRequest): Promise<AuthResponse | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = mockUsers.find(
        (u) => u.email === request.email && u.password === request.password
      );
      if (user) {
        resolve({
          user: { id: user.id, email: user.email, name: user.name },
          token: "fake-jwt-token",
        });
      } else {
        resolve(null);
      }
    }, 500);
  });
};

export const register = (
  request: RegisterRequest
): Promise<AuthResponse | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const existingUser = mockUsers.find((u) => u.email === request.email);
      if (existingUser) {
        resolve(null); // User already exists
      } else {
        const newUser = {
          id: `user${mockUsers.length + 1}`,
          email: request.email,
          name: request.name,
          password: request.password,
        };
        mockUsers.push(newUser);
        resolve({
          user: { id: newUser.id, email: newUser.email, name: newUser.name },
          token: "fake-jwt-token",
        });
      }
    }, 500);
  });
};

// Product management API functions
export const createProduct = (
  product: Omit<Product, "id">
): Promise<Product> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newProduct: Product = {
        ...product,
        id: `product-${Date.now()}`,
      };
      mockProducts.push(newProduct);
      resolve(newProduct);
    }, 500);
  });
};

export const updateProduct = (
  id: string,
  product: Omit<Product, "id">
): Promise<Product | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockProducts.findIndex((p) => p.id === id);
      if (index !== -1) {
        const updatedProduct: Product = {
          ...product,
          id,
        };
        mockProducts[index] = updatedProduct;
        resolve(updatedProduct);
      } else {
        resolve(null);
      }
    }, 500);
  });
};

export const deleteProduct = (id: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockProducts.findIndex((p) => p.id === id);
      if (index !== -1) {
        mockProducts.splice(index, 1);
        resolve(true);
      } else {
        resolve(false);
      }
    }, 500);
  });
};

// Mock S3 presigned URL request
export const getPresignedUrl = (
  filename: string
): Promise<{ uploadUrl: string; imageUrl: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real app, this would return actual S3 presigned URLs
      resolve({
        uploadUrl: `https://fake-s3-bucket.s3.amazonaws.com/uploads/${filename}`,
        imageUrl: `https://fake-s3-bucket.s3.amazonaws.com/uploads/${filename}`,
      });
    }, 300);
  });
};

// Additional admin features
export const getProductStats = (): Promise<{
  totalProducts: number;
  totalValue: number;
  lowStockProducts: Product[];
  topCategories: { category: string; count: number }[];
}> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const totalProducts = mockProducts.length;
      const totalValue = mockProducts.reduce(
        (sum, p) => sum + p.price * p.stock,
        0
      );
      const lowStockProducts = mockProducts.filter((p) => p.stock < 20);

      const categoryCount = mockProducts.reduce((acc, p) => {
        acc[p.category] = (acc[p.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const topCategories = Object.entries(categoryCount)
        .map(([category, count]) => ({ category, count }))
        .sort((a, b) => b.count - a.count);

      resolve({
        totalProducts,
        totalValue,
        lowStockProducts,
        topCategories,
      });
    }, 300);
  });
};

export const updateProductStock = (
  id: string,
  newStock: number
): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const product = mockProducts.find((p) => p.id === id);
      if (product) {
        product.stock = newStock;
        resolve(true);
      } else {
        resolve(false);
      }
    }, 300);
  });
};

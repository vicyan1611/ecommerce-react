import { gql } from "@apollo/client";

export const GET_PRODUCTS = gql`
  query GetProducts($page: Int, $limit: Int) {
    products(page: $page, limit: $limit) {
      id
      product_id
      name
      description
      price
      inventory_count
      category {
        id
        name
        description
      }
      images {
        id
        image_url
        alt_text
        is_thumbnail
      }
      created_at
      updated_at
    }
  }
`;

export const GET_PRODUCT_BY_ID = gql`
  query GetProduct($id: Int!) {
    product(id: $id) {
      id
      product_id
      name
      description
      price
      inventory_count
      category {
        id
        name
        description
      }
      images {
        id
        image_url
        alt_text
        is_thumbnail
      }
      created_at
      updated_at
    }
  }
`;

export const GET_PRODUCTS_BY_CATEGORY = gql`
  query GetProductsByCategory($categoryId: Int!, $page: Int, $limit: Int) {
    productsByCategory(categoryId: $categoryId, page: $page, limit: $limit) {
      id
      product_id
      name
      description
      price
      inventory_count
      category {
        id
        name
        description
      }
      images {
        id
        image_url
        alt_text
        is_thumbnail
      }
      created_at
      updated_at
    }
  }
`;

export const SEARCH_PRODUCTS = gql`
  query SearchProducts(
    $searchTerm: String!
    $page: Int
    $limit: Int
    $categoryId: Int
  ) {
    searchProducts(
      searchTerm: $searchTerm
      page: $page
      limit: $limit
      categoryId: $categoryId
    ) {
      id
      product_id
      name
      description
      price
      inventory_count
      category {
        id
        name
        description
      }
      images {
        id
        image_url
        alt_text
        is_thumbnail
      }
      created_at
      updated_at
    }
  }
`;

export const CREATE_PRODUCT = gql`
  mutation CreateProduct($data: ProductInput!) {
    createProduct(data: $data) {
      id
      product_id
      name
      description
      price
      inventory_count
      category {
        id
        name
        description
      }
      images {
        id
        image_url
        alt_text
        is_thumbnail
      }
      created_at
      updated_at
    }
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($id: Int!, $data: ProductInput!) {
    updateProduct(id: $id, data: $data) {
      id
      product_id
      name
      description
      price
      inventory_count
      category {
        id
        name
        description
      }
      images {
        id
        image_url
        alt_text
        is_thumbnail
      }
      created_at
      updated_at
    }
  }
`;

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: Int!) {
    deleteProduct(id: $id)
  }
`;

// Legacy alias for backward compatibility
export const GET_FEATURE_PRODUCTS = GET_PRODUCTS;

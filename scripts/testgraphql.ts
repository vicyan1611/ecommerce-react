import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  gql,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: "http://localhost:3000/graphql",
});

const authLink = setContext((_, { headers }) => {
  // You can set a Bearer token here if you want to test authenticated requests
  // const token = 'your_access_token_here';
  return {
    headers: {
      ...headers,
      // authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

// Test public query (no auth required)
client
  .query({
    query: gql`
      query GetProducts($page: Int, $limit: Int) {
        products(page: $page, limit: $limit) {
          id
          name
          price
          category {
            name
          }
        }
      }
    `,
    variables: { page: 1, limit: 5 },
  })
  .then((response) => {
    console.log("Products:", response.data);
  })
  .catch((error) => {
    console.error("Error fetching products:", error);
  });

// Test authentication endpoints
console.log("Testing authentication endpoints...");

// Test registration
client
  .mutate({
    mutation: gql`
      mutation Register($data: RegisterInput!) {
        register(data: $data) {
          user {
            id
            email
            name
          }
          accessToken
          refreshToken
        }
      }
    `,
    variables: {
      data: {
        email: "test@example.com",
        name: "Test User",
        password: "testpassword123",
      },
    },
  })
  .then((response) => {
    console.log("Registration successful:", response.data);
  })
  .catch((error) => {
    console.error(
      "Registration error:",
      error.graphQLErrors?.[0]?.message || error.message
    );
  });

// Test login
client
  .mutate({
    mutation: gql`
      mutation Login($data: LoginInput!) {
        login(data: $data) {
          user {
            id
            email
            name
            is_admin
          }
          accessToken
          refreshToken
        }
      }
    `,
    variables: {
      data: {
        email: "demo@example.com",
        password: "password123",
      },
    },
  })
  .then((response) => {
    console.log("Login successful:", response.data);
  })
  .catch((error) => {
    console.error(
      "Login error:",
      error.graphQLErrors?.[0]?.message || error.message
    );
  });

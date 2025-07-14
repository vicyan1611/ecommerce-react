import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
  from,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import { updateTokens, logout } from "./store/authSlice";
import { refreshAccessToken } from "./api/tokenService";
import AuthInitializer from "./components/AuthInitializer";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/Homepage.tsx";
import ProductsPage from "./pages/ProductsPage.tsx";
import ProductDetailsPage from "./pages/ProductDetailsPage.tsx";
import CartPage from "./pages/CartPage.tsx";
import CheckoutPage from "./pages/CheckoutPage.tsx";
import AuthPage from "./pages/AuthPage.tsx";
import AdminDashboard from "./pages/AdminDashboard.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";

const httpLink = createHttpLink({
  uri: "http://localhost:3000/api",
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("accessToken");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// Error handling link for automatic token refresh
const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      for (const err of graphQLErrors) {
        if (
          err.message === "Invalid or expired token" ||
          err.message === "Authentication required"
        ) {
          // Try to refresh the token
          const refreshToken = localStorage.getItem("refreshToken");
          if (refreshToken) {
            refreshAccessToken(refreshToken)
              .then((newTokens) => {
                if (newTokens) {
                  // Update tokens in store and localStorage
                  store.dispatch(updateTokens(newTokens));

                  // Retry the failed operation with new token
                  const oldHeaders = operation.getContext().headers;
                  operation.setContext({
                    headers: {
                      ...oldHeaders,
                      authorization: `Bearer ${newTokens.accessToken}`,
                    },
                  });

                  // Re-run the operation
                  forward(operation);
                } else {
                  // Refresh failed, logout user
                  store.dispatch(logout());
                }
              })
              .catch(() => {
                // Refresh failed, logout user
                store.dispatch(logout());
              });
          } else {
            // No refresh token, logout user
            store.dispatch(logout());
          }
        }
      }
    }

    if (networkError) {
      console.error("Network error:", networkError);
    }
  }
);

const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/products",
    element: <ProductsPage />,
  },
  {
    path: "/products/:id",
    element: <ProductDetailsPage />,
  },
  {
    path: "/cart",
    element: <CartPage />,
  },
  {
    path: "/checkout",
    element: (
      <ProtectedRoute>
        <CheckoutPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/auth",
    element: <AuthPage />,
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute requireAdmin={true}>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    ),
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <ApolloProvider client={client}>
        <AuthInitializer>
          <RouterProvider router={router} />
        </AuthInitializer>
      </ApolloProvider>
    </Provider>
  </StrictMode>
);

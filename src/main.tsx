import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import AuthInitializer from "./components/AuthInitializer";
import HomePage from "./pages/Homepage.tsx";
import ProductsPage from "./pages/ProductsPage.tsx";
import ProductDetailsPage from "./pages/ProductDetailsPage.tsx";
import CartPage from "./pages/CartPage.tsx";
import CheckoutPage from "./pages/CheckoutPage.tsx";
import AuthPage from "./pages/AuthPage.tsx";
import AdminDashboard from "./pages/AdminDashboard.tsx";

const client = new ApolloClient({
  uri: "http://localhost:3000/api/",
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
    element: <CheckoutPage />,
  },
  {
    path: "/auth",
    element: <AuthPage />,
  },
  {
    path: "/admin",
    element: <AdminDashboard />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <AuthInitializer>
        <ApolloProvider client={client}>
          <RouterProvider router={router} />
        </ApolloProvider>
      </AuthInitializer>
    </Provider>
  </StrictMode>
);

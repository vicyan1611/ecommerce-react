# Ecommerce Frontend

### **Component and Page Implementation Plan**

Here’s a breakdown of the components and state management for each page.

#### **Global Components (in `/layouts` and `/components`)**

- **Header:** Will contain the navigation links, search bar, and cart icon. It will read the cart item count from the Redux store.
- **Footer:** Standard footer with links and information.
- **ProductCard:** A reusable component to display a product's image, name, and price on the Home and Products pages.

#### **Pages Breakdown**

**1. 🏠 Home Page (`/pages/HomePage.tsx`)**

- **Components:** `Header`, `Footer`, `ProductCard`.
- **State:** Use `useEffect` to fetch a list of featured products from your API on component mount. Store the products in local state with `useState`.
- **Backend Interaction:** Makes a `GET` request to an endpoint like `/api/products?featured=true`.
  **2. 🛍️ Products Catalog Page (`/pages/ProductsPage.tsx`)**
- **Components:** `SearchBar`, `FilterSidebar`, `SortDropdown`, `ProductCard`.
- **State:**
  - `products`: Stores the list of all products.
  - `searchTerm`: Managed by the `SearchBar` component.
  - `filters`: An object to hold filter values (e.g., `{ category: 'Electronics', priceRange: '0-100' }`).
  - `sortKey`: Stores the current sorting option.
- **Backend Interaction:** Fetches products from `/api/products`. All filtering, sorting, and searching logic should ideally be handled by the backend API to optimize performance and leverage your database/ElastiCache layer. For example: `GET /api/products?search=laptop&category=pc&sort=price_asc`.
  **3. 📦 Product Detail Page (`/pages/ProductDetailPage.tsx`)**
- **Components:** `ImageGallery`, `AddToCartButton`.
- **State:** Use `useEffect` and the `useParams` hook from `react-router-dom` to get the product `id` from the URL. Fetch detailed data for that specific product.
- **Backend Interaction:** `GET` request to `/api/products/{id}`. The "Add to Cart" button will dispatch a Redux action to add the item to the cart state. Product images will be loaded from your CloudFront URL, which points to the S3 bucket.
  **4. 🛒 Shopping Cart Page (`/pages/CartPage.tsx`)**
- **Components:** `CartItem`, `OrderSummary`.
- **State:** The entire page will be driven by the global cart state managed in your Redux store. Use the `useSelector` hook to read the cart items.
- **Backend Interaction:** No direct API calls are needed to display the cart. Updating quantities or removing items will dispatch Redux actions. The "Proceed to Checkout" button navigates the user to `/checkout`.
  **5. 💳 Checkout Page (`/pages/CheckoutPage.tsx`)**
- **Components:** `ShippingForm`, `PaymentForm` (mock).
- **State:** Use `useState` to manage form inputs for shipping details.
- **Backend Interaction:** The "Place Order" button will gather cart data from the Redux store and shipping information from the form. It then sends a `POST` request to `/api/orders` to initiate the order processing Lambda function. After a successful order, clear the cart (dispatch a Redux action) and navigate to the `/order-success` page.
  **6. 🔑 Login & Register Page (`/pages/AuthPage.tsx`)**
- **Components:** `LoginForm`, `RegisterForm`. Use tabs or conditional rendering to switch between them.
- **State:** Local state for form fields (email, password).
- **Backend Interaction:** - Login: `POST` to `/api/auth/login`. On success, store the received JWT (JSON Web Token) in local storage and update the global user state in Redux. - Register: `POST` to `/api/auth/register`.
  **7. ✅ Order Confirmation Page (`/pages/OrderSuccessPage.tsx`)**
- **Components:** Simple static page.
- **State:** You might pass the order ID via route state from the checkout page to display it here.
- **Backend Interaction:** None. This is a simple confirmation view.
  **8. 🔒 Admin Dashboard (`/pages/AdminDashboard.tsx`)**
- **Components:** `ProductForm`, `ImageUploader`.
- **State:** State to manage the product form fields (name, price, etc.) and the file for the image uploader.
- **Backend Interaction:**
  - **Image Upload:** The `ImageUploader` component will make a `POST` request to a presigned S3 URL (requested from your backend) to upload the image directly to S3. This is a common and secure pattern that avoids proxying the file through your server.
  - **Product Creation/Update:** The form submission will trigger a `POST` (create) or `PUT` (update) request to `/api/products` with the product details.

---

### **3. State Management with Redux Toolkit**

For a scalable e-commerce site, Redux is a good choice for managing global state like the shopping cart and user authentication.

- **`cartSlice.ts`:** Manages the cart state.
  - **State:** `{ items: [], totalQuantity: 0, totalAmount: 0 }`
  - **Reducers:** `addItemToCart`, `removeItemFromCart`, `updateItemQuantity`, `clearCart`.
- **`authSlice.ts`:** Manages user authentication.
  - **State:** `{ user: null, token: null, isAuthenticated: false }`
  - **Reducers:** `loginSuccess`, `logout`.

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux';
import { store } from './store';        // 2. Import your store
import './index.css'
import Main from './Layouts/main'
import Home from './Pages/Home'
import { createBrowserRouter, RouterProvider } from "react-router";
import Register from './Pages/Register'
import Login from './Pages/Login'
import ProductDetailpage from './Pages/ProductDetailpage'
import { Toaster } from './Components/ui/sonner';
import ProtectedRoute from './Protectors/ProtectedRoute';
import Profile from './Pages/Profile';
import ResetPassword from './Pages/PasswordReset';
import ForgetPassword from './Pages/ForgetPassword';
import ProductFilter from './Pages/ProductFilter';
import AdminRoute from './Protectors/IsAdmin';
import AdminLayout from './Pages/Admin/Layout';
import AdminDashboard from './Pages/Admin/AdminDashborad';
import ProductCreate from './Pages/ProductCreate/ProductCreate';
import ProductUpdate from './Pages/ProductCreate/ProductUpdate';
import ProductManagement from './Pages/Admin/ProductManagement';
import OrderSuccess from './Pages/OrderSuccess';
import OrderCancelled from './Pages/OrderCancelled';
import OrderManagement from './Pages/Admin/OrderManagement';
import MyOrders from './Pages/MyOrders';
// ... other imports

const router = createBrowserRouter([
  {
    path: "/",
    Component: Main, // Global wrapper (Header, Footer, etc.)
    children: [
      // --- PUBLIC ROUTES ---
      { index: true, Component: Home },
      { path: "register", Component: Register },
      { path: "login", Component: Login },
      { path: "reset-password/:token", Component: ResetPassword },
      { path: "forget-password", Component: ForgetPassword },
      { path: "product/:id", Component: ProductDetailpage },
      { path: "product-filter", element: <ProductFilter /> },

      // --- PROTECTED ROUTES (All Users) ---
      {
        element: <ProtectedRoute />,
        children: [
          { path: "profile", Component: Profile },

          { path: "order-success", Component: OrderSuccess },
          { path: "order-cancelled", Component: OrderCancelled },
          { path: "my-orders", Component: MyOrders },
          {
            element: <AdminRoute />, // Second Gate: Role Check
            children: [
              {
                path: "admin",
                element: <AdminLayout />, // Admin Sidebar + Content Area
                children: [
                  { index: true, Component: AdminDashboard },
                  { path: "dashboard", Component: AdminDashboard },
                  { path: "manage-products", Component: ProductManagement },
                  { path: "manage-orders", Component: OrderManagement },
                  { path: "product-create", Component: ProductCreate }, // This is your "Create Product" page
                  { path: "product-edit/:id", Component: ProductUpdate },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <Toaster />
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
)
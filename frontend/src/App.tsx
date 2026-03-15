import { BrowserRouter, Routes, Route } from "react-router";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { Layout } from "@/components/Layout";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import CreateListingPage from "@/pages/CreateListingPage";
import EditListingPage from "@/pages/EditListingPage";
import MyListingsPage from "@/pages/MyListingsPage";
import CartPage from "@/pages/CartPage";
import CheckoutPage from "@/pages/CheckoutPage";
import OrdersPage from "@/pages/OrdersPage";
import OrderDetailPage from "@/pages/OrderDetailPage";
import SalesPage from "@/pages/SalesPage";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminProducts from "@/pages/admin/AdminProducts";
import AdminOrders from "@/pages/admin/AdminOrders";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/products/new" element={<CreateListingPage />} />
              <Route path="/products/:id" element={<ProductDetailPage />} />
              <Route path="/products/:id/edit" element={<EditListingPage />} />
              <Route path="/my-listings" element={<MyListingsPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/orders/:id" element={<OrderDetailPage />} />
              <Route path="/sales" element={<SalesPage />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
            </Routes>
          </Layout>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

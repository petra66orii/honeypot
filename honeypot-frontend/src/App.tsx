import { Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ProductGrid from "./components/ProductGrid";
import ProductDetail from "./pages/ProductDetail";
import ShoppingBag from "./pages/ShoppingBag";
import Checkout from "./pages/Checkout";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import BlogList from "./pages/BlogList";
import BlogPost from "./pages/BlogPost";
import GiftsDeals from "./pages/GiftsDeals";
import Contact from "./pages/Contact";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Forbidden from "./pages/Forbidden";
import ServerError from "./pages/ServerError";
import ProtectedRoute from "./components/ProtectedRoute";

import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminProductForm from "./pages/admin/AdminProductForm";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminContent from "./pages/admin/AdminContent";

function App() {
  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-900">
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/gifts" element={<GiftsDeals />} />
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductGrid />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/bag" element={<ShoppingBag />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/checkout/success" element={<CheckoutSuccess />} />
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/forbidden" element={<Forbidden />} />
        <Route path="/server-error" element={<ServerError />} />

        {/* --- ADMIN ROUTES (PROTECTED) --- */}
        {/* The Wrapper checks if user is Admin. If yes, it renders the AdminLayout */}
        <Route element={<ProtectedRoute adminOnly={true} />}>
          <Route path="/admin" element={<AdminLayout />}>
            {/* These render INSIDE the AdminLayout <Outlet /> */}
            <Route index element={<Dashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/new" element={<AdminProductForm />} />
            <Route path="products/edit/:id" element={<AdminProductForm />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="content" element={<AdminContent />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;

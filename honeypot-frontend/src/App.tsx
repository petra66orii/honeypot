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
      </Routes>
      <Footer />
    </div>
  );
}

export default App;

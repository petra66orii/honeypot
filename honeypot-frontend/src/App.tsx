import { Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import ProductGrid from "./components/ProductGrid";
import ProductDetail from "./pages/ProductDetail";
import ShoppingBag from "./pages/ShoppingBag";

function App() {
  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-900">
      <Navbar />
      <Routes>
        <Route path="/" element={<ProductGrid />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/bag" element={<ShoppingBag />} />
      </Routes>
    </div>
  );
}

export default App;

import { Routes, Route } from "react-router-dom";
import "./App.css";
import ProductGrid from "./components/ProductGrid";
import ProductDetail from "./pages/ProductDetail";

function App() {
  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-900">
      <Routes>
        <Route path="/" element={<ProductGrid />} />
        <Route path="/products/:id" element={<ProductDetail />} />
      </Routes>
    </div>
  );
}

export default App;

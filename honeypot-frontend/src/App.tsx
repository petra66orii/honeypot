import { Routes, Route } from "react-router-dom";
import "./App.css";
import ProductGrid from "./components/ProductGrid";

function App() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Routes>
        <Route path="/" element={<ProductGrid />} />
      </Routes>
    </div>
  );
}

export default App;

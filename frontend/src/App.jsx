import { useState } from "react";
import ProductList from "./components/ProductList";
import ProductForm from "./components/ProductForm";
export default function App() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">BongoCommerce</h1>

      {/* Toggle button */}
      {!showForm && (
        <div className="text-center mb-6">
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-500 text-white px-6 py-3 rounded shadow hover:bg-blue-600 transition"
          >
            Add Product
          </button>
        </div>
      )}

      {/* Product form */}
      {showForm && (
        <ProductForm
          setProducts={setProducts}
          onClose={() => setShowForm(false)} // hide form after save
        />
      )}

      {/* Product list */}
      <ProductList products={products} setProducts={setProducts} />
    </div>
  );
}

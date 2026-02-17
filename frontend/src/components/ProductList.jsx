import { useEffect } from "react";

const LAMBDA_URL = import.meta.env.VITE_LAMBDA_URL;

export default function ProductList({ products, setProducts }) {

  const loadProducts = async () => {
    try {
      const res = await fetch(LAMBDA_URL, { method: "GET" });
      if (!res.ok) throw new Error(`Failed to fetch products: ${res.statusText}`);

      const data = await res.json();
      const items = Array.isArray(data.Items) ? data.Items : data; // fallback
      setProducts(items.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await fetch(`${LAMBDA_URL}?productId=${id}`, { method: "DELETE" });
      setProducts(products.filter((p) => p.productId !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line
  }, []);

  if (!products || products.length === 0) 
    return <p className="text-center mt-8 text-gray-500">No products yet.</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 max-w-4xl mx-auto">
      {products.map((p) => (
        <div key={p.productId} className="bg-white p-5 rounded-xl shadow">
          <img src={p.imageUrl} className="h-40 w-full object-cover rounded" />
          <h3 className="font-bold mt-3">{p.title}</h3>
          <p className="text-gray-600">{p.description}</p>
          <p className="font-semibold">${p.price}</p>

          <button onClick={() => deleteProduct(p.productId)}
            className="mt-3 bg-red-500 text-white px-4 py-2 rounded">
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

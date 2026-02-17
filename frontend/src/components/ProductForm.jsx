import { useState } from "react";

const LAMBDA_URL = import.meta.env.VITE_LAMBDA_URL;

export default function ProductForm({ setProducts, onClose }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    imageUrl: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(LAMBDA_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, price: Number(form.price) })
      });

      const newProduct = await res.json();
      setProducts(prev => [newProduct, ...prev]); // add new product to top
      setForm({ title: "", description: "", price: "", imageUrl: "" }); // reset form
      onClose(); // hide form after save
    } catch (err) {
      console.error("Error creating product:", err);
      alert("Failed to create product!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-6 p-5 bg-white rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">Add New Product</h2>

      <input
        type="text"
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Title"
        className="w-full mb-3 p-2 border rounded"
        required
      />

      <input
        type="text"
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Description"
        className="w-full mb-3 p-2 border rounded"
      />

      <input
        type="number"
        name="price"
        value={form.price}
        onChange={handleChange}
        placeholder="Price"
        className="w-full mb-3 p-2 border rounded"
        required
      />

      <input
        type="text"
        name="imageUrl"
        value={form.imageUrl}
        onChange={handleChange}
        placeholder="Image URL"
        className="w-full mb-3 p-2 border rounded"
      />

      <div className="flex justify-between items-center">
        <button
          type="submit"
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
        >
          {loading ? "Saving..." : "Save Product"}
        </button>

        <button
          type="button"
          onClick={onClose}
          className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

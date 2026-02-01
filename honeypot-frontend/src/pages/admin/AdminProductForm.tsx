import React, { useState, useCallback } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useDropzone } from "react-dropzone"; // <--- THE NEW MAGIC IMPORT
import {
  useGetProductQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useGetCategoriesQuery,
} from "../../services/api";
import type { Product, Category } from "../../services/types";

// --- TYPES ---
interface ApiError {
  data?: { detail?: string; message?: string } | string;
  status?: number;
  message?: string;
}

interface ProductFormContentProps {
  isEditMode: boolean;
  productToEdit?: Product;
  categories?: Category[];
  onSubmit: (formData: FormData) => Promise<void>;
  isSaving: boolean;
}

// --- CHILD COMPONENT ---
const ProductFormContent: React.FC<ProductFormContentProps> = ({
  isEditMode,
  productToEdit,
  categories,
  onSubmit,
  isSaving,
}) => {
  // State
  const [name, setName] = useState(productToEdit?.name || "");
  const [description, setDescription] = useState(
    productToEdit?.description || "",
  );
  const [price, setPrice] = useState(productToEdit?.price?.toString() || "");
  const [category, setCategory] = useState(
    productToEdit?.category?.id?.toString() || "",
  );
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(
    productToEdit?.image || null,
  );

  // --- DROPZONE LOGIC ---
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setImage(file);
      setPreview(URL.createObjectURL(file)); // Create local preview URL
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    multiple: false, // Only allow one file
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("description", description.trim());
    formData.append("price", price);
    if (category) formData.append("category_id", category);
    if (image instanceof File) formData.append("image", image);

    onSubmit(formData);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          {isEditMode ? "Edit Product" : "New Product"}
        </h1>
        <Link
          to="/admin/products"
          className="text-gray-500 hover:text-gray-700"
        >
          Cancel
        </Link>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 space-y-6"
      >
        {/* --- REACT DROPZONE AREA --- */}
        <div className="flex justify-center mb-6">
          <div className="text-center">
            {/* The Dropzone Div: We spread the props here */}
            <div
              {...getRootProps()}
              className={`w-40 h-40 bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed mx-auto flex items-center justify-center relative cursor-pointer transition
                ${isDragActive ? "border-honey-gold bg-yellow-50" : "border-gray-300 hover:border-honey-gold"}
              `}
            >
              {/* The Invisible Input: Controlled by the library */}
              <input
                {...getInputProps()}
                // Note: We don't need to call the original onClick for file inputs usually,
                // as the browser handles it natively.
              />

              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="p-4 text-gray-400 text-sm">
                  {isDragActive
                    ? "Drop it here!"
                    : "Drag & drop or click to upload"}
                </div>
              )}

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 hover:opacity-100 transition pointer-events-none">
                Change Image
              </div>
            </div>
          </div>
        </div>

        {/* --- FIELDS --- */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Product Name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-honey-gold focus:ring-honey-gold p-2 border"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Price (€)
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-honey-gold focus:ring-honey-gold p-2 border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-honey-gold focus:ring-honey-gold p-2 border"
            >
              <option value="">Select Category...</option>
              {categories?.map((cat: Category) => (
                <option key={cat.id} value={cat.id}>
                  {cat.friendly_name || cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            rows={4}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-honey-gold focus:ring-honey-gold p-2 border"
          />
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="w-full bg-honey-gold text-white font-bold text-lg py-3 rounded-md hover:bg-yellow-500 transition shadow-md disabled:opacity-50"
        >
          {isSaving
            ? "Saving..."
            : isEditMode
              ? "Update Product"
              : "Create Product"}
        </button>
      </form>
    </div>
  );
};

// --- PARENT COMPONENT ---
const AdminProductForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  // Hooks
  const { data: categories } = useGetCategoriesQuery();
  const { data: productToEdit, isLoading } = useGetProductQuery(id!, {
    skip: !isEditMode,
  });

  const [addProduct, { isLoading: isAdding }] = useAddProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const handleFormSubmit = async (formData: FormData) => {
    try {
      if (isEditMode && id) {
        await updateProduct({ id: Number(id), data: formData }).unwrap();
        alert("Product Updated! 🍯");
      } else {
        await addProduct(formData).unwrap();
        alert("Product Created! 🎉");
      }
      navigate("/admin/products");
    } catch (err) {
      console.error("Failed to save:", err);
      const error = err as ApiError;
      const msg = error?.data || error?.message || "An unknown error occurred";
      alert(`Error: ${typeof msg === "object" ? JSON.stringify(msg) : msg}`);
    }
  };

  if (isEditMode && isLoading) {
    return (
      <div className="text-center p-10 text-gray-500">
        Loading product details...
      </div>
    );
  }

  // Force re-mount when ID changes to reset state
  return (
    <ProductFormContent
      key={id || "new"}
      isEditMode={isEditMode}
      productToEdit={productToEdit}
      categories={categories}
      onSubmit={handleFormSubmit}
      isSaving={isAdding || isUpdating}
    />
  );
};

export default AdminProductForm;

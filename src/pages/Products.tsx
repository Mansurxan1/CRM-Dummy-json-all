import {
  useGetProductsQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from '../store/features/api/apiSlice';
import { useState } from 'react';

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
}

interface ApiResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

const Products = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  const skip = (page - 1) * limit;

  const { data, isLoading, error } = useGetProductsQuery({ limit, skip }) as {
    data: ApiResponse | undefined;
    isLoading: boolean;
    error: any;
  };
  const [addProduct] = useAddProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const [newProduct, setNewProduct] = useState({ title: '', price: 0, description: '' });
  const [localProducts, setLocalProducts] = useState<Product[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);

  const products: Product[] = [...(data?.products || []), ...localProducts];
  const totalPages = Math.ceil((data?.total || 0) / limit);

  const handleAddProduct = async () => {
    if (!newProduct.title || newProduct.price <= 0) {
      setErrorMessage("Iltimos, barcha maydonlarni to‘g‘ri to‘ldiring!");
      return;
    }
    try {
      console.log("POST so‘rovi yuborilmoqda:", newProduct);
      const response = await addProduct(newProduct).unwrap();
      console.log("API javobi:", response);
      const newProductData: Product = {
        id: response.id || Date.now(),
        title: newProduct.title,
        price: newProduct.price,
        description: newProduct.description,
      };
      setLocalProducts((prev) => [...prev, newProductData]);
      setNewProduct({ title: '', price: 0, description: '' });
      setErrorMessage(null);
      setSuccessMessage('Mahsulot muvaffaqiyatli qo‘shildi!');
      console.log('Yangi mahsulot qo‘shildi:', newProductData);
      console.log('Barcha mahsulotlar:', [...products, newProductData]);
    } catch (err: any) {
      console.error('Qo‘shishda xato:', err);
      setErrorMessage(err?.data?.message || 'Mahsulot qo‘shishda xato yuz berdi!');
    }
  };

  const handleEditProduct = (product: Product) => {
    setNewProduct({
      title: product.title,
      price: product.price,
      description: product.description,
    });
    setEditingProductId(product.id);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleUpdateProduct = async () => {
    if (!editingProductId) {
      setErrorMessage('Yangilash uchun mahsulot tanlanmadi!');
      return;
    }
    if (!newProduct.title || newProduct.price <= 0) {
      setErrorMessage("Iltimos, barcha maydonlarni to‘g‘ri to‘ldiring!");
      return;
    }
    try {
      await updateProduct({ id: editingProductId, ...newProduct }).unwrap();
      setLocalProducts((prev) =>
        prev.map((product) =>
          product.id === editingProductId ? { ...product, ...newProduct } : product
        )
      );
      setNewProduct({ title: '', price: 0, description: '' });
      setEditingProductId(null);
      setErrorMessage(null);
      setSuccessMessage('Mahsulot muvaffaqiyatli yangilandi!');
      console.log('Mahsulot yangilandi:', { id: editingProductId, ...newProduct });
      console.log('Barcha mahsulotlar:', products);
    } catch (err: any) {
      console.error('Yangilashda xato:', err);
      setErrorMessage(err?.data?.message || 'Mahsulot yangilashda xato yuz berdi!');
    }
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      await deleteProduct(id).unwrap();
      setLocalProducts((prev) => prev.filter((product) => product.id !== id));
      setErrorMessage(null);
      setSuccessMessage('Mahsulot muvaffaqiyatli o‘chirildi!');
      console.log('Mahsulot o‘chirildi:', id);
      console.log('Barcha mahsulotlar:', products.filter((product) => product.id !== id));
    } catch (err: any) {
      console.error('O‘chirishda xato:', err);
      setErrorMessage(err?.data?.message || 'Mahsulot o‘chirishda xato yuz berdi!');
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      console.log(`Sahifa o‘zgartirildi: ${newPage}`);
    }
  };

  if (isLoading) return <div className="p-4">Yuklanmoqda...</div>;
  if (error) return <div className="p-4 text-red-500">Xato yuz berdi: {JSON.stringify(error)}</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Mahsulotlar</h2>

      {errorMessage && (
        <div className="text-red-500 mb-4 p-2 bg-red-100 rounded">{errorMessage}</div>
      )}
      {successMessage && (
        <div className="text-green-500 mb-4 p-2 bg-green-100 rounded">{successMessage}</div>
      )}

      <div className="mb-6 p-4 bg-white rounded shadow">
        <h3 className="text-lg font-semibold mb-2">
          {editingProductId ? 'Mahsulotni yangilash' : 'Yangi Mahsulot'}
        </h3>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Mahsulot nomini kiriting"
            value={newProduct.title}
            onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
            className="border p-2 rounded flex-1"
          />
          <input
            type="number"
            placeholder="Narxni kiriting"
            value={newProduct.price === 0 && !editingProductId ? '' : newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
            className="border p-2 rounded flex-1"
          />
          <input
            type="text"
            placeholder="Mahsulot tavsifini kiriting"
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            className="border p-2 rounded flex-1"
          />
        </div>
        <div className="mt-2 flex gap-2">
          {editingProductId ? (
            <>
              <button
                onClick={handleUpdateProduct}
                className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600"
              >
                Yangilash
              </button>
              <button
                onClick={() => {
                  setNewProduct({ title: '', price: 0, description: '' });
                  setEditingProductId(null);
                }}
                className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
              >
                Bekor qilish
              </button>
            </>
          ) : (
            <button
              onClick={handleAddProduct}
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Qo‘shish
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded shadow">
        <h3 className="text-lg font-semibold p-4">Mahsulotlar ro‘yxati</h3>
        {products.length === 0 ? (
          <p className="p-4 text-gray-500">Mahsulotlar mavjud emas</p>
        ) : (
          <ul>
            {products.map((product) => (
              <li
                key={product.id}
                className="flex items-center justify-between p-4 border-b hover:bg-gray-50"
              >
                <span>
                  {product.title} (${product.price}) - {product.description}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="bg-yellow-500 text-white p-1 rounded hover:bg-yellow-600"
                  >
                    Tahrirlash
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
                  >
                    O‘chirish
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-6 flex justify-center gap-2">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className="p-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
        >
          Oldingi
        </button>
        <span className="p-2">
          {page} / {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
          className="p-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
        >
          Keyingi
        </button>
      </div>
    </div>
  );
};

export default Products;
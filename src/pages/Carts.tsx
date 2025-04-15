import {
  useGetCartsQuery,
  useAddCartMutation,
  useUpdateCartMutation,
  useDeleteCartMutation,
} from '../store/features/api/apiSlice';
import { useState } from 'react';

interface Cart {
  id: number;
  userId: number;
  total: number;
  products: { productId: number; quantity: number }[];
}

interface ApiResponse {
  carts: Cart[];
  total: number;
  skip: number;
  limit: number;
}

const Carts = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  const skip = (page - 1) * limit;

  const { data, isLoading, error, refetch } = useGetCartsQuery({ limit, skip }) as {
    data: ApiResponse | undefined;
    isLoading: boolean;
    error: any;
    refetch: () => void;
  };
  const [addCart] = useAddCartMutation();
  const [updateCart] = useUpdateCartMutation();
  const [deleteCart] = useDeleteCartMutation();

  const [newCart, setNewCart] = useState({
    userId: 0,
    products: [{ productId: 0, quantity: 0 }],
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [editingCartId, setEditingCartId] = useState<number | null>(null);

  const carts: Cart[] = data?.carts || [];
  const totalPages = Math.ceil((data?.total || 0) / limit);

  const handleAddCart = async () => {
    if (
      newCart.userId <= 0 ||
      newCart.products[0].productId <= 0 ||
      newCart.products[0].quantity <= 0
    ) {
      setErrorMessage("Iltimos, barcha maydonlarni to‘g‘ri to‘ldiring!");
      return;
    }
    try {
      const payload = {
        userId: Number(newCart.userId),
        products: newCart.products.map((p) => ({
          productId: Number(p.productId),
          quantity: Number(p.quantity),
        })),
      };
      console.log("POST so‘rovi yuborilmoqda:", payload);
      const response = await addCart(payload).unwrap();
      console.log("API javobi:", response);
      setNewCart({ userId: 0, products: [{ productId: 0, quantity: 0 }] });
      setErrorMessage(null);
      setSuccessMessage('Savat muvaffaqiyatli qo‘shildi!');
      refetch();
    } catch (err: any) {
      console.error("Qo‘shishda xato:", JSON.stringify(err, null, 2));
      setErrorMessage(err?.data?.message || 'Savat qo‘shishda xato yuz berdi!');
    }
  };

  const handleEditCart = (cart: Cart) => {
    setNewCart({
      userId: cart.userId,
      products: cart.products,
    });
    setEditingCartId(cart.id);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleUpdateCart = async () => {
    if (!editingCartId) {
      setErrorMessage('Yangilash uchun savat tanlanmadi!');
      return;
    }
    if (
      newCart.userId <= 0 ||
      newCart.products[0].productId <= 0 ||
      newCart.products[0].quantity <= 0
    ) {
      setErrorMessage("Iltimos, barcha maydonlarni to‘g‘ri to‘ldiring!");
      return;
    }
    try {
      const payload = {
        userId: Number(newCart.userId),
        products: newCart.products.map((p) => ({
          productId: Number(p.productId),
          quantity: Number(p.quantity),
        })),
      };
      await updateCart({ id: editingCartId, ...payload }).unwrap();
      setNewCart({ userId: 0, products: [{ productId: 0, quantity: 0 }] });
      setEditingCartId(null);
      setErrorMessage(null);
      setSuccessMessage('Savat muvaffaqiyatli yangilandi!');
      refetch();
    } catch (err: any) {
      console.error("Yangilashda xato:", JSON.stringify(err, null, 2));
      setErrorMessage(err?.data?.message || 'Savat yangilashda xato yuz berdi!');
    }
  };

  const handleDeleteCart = async (id: number) => {
    try {
      await deleteCart(id).unwrap();
      setErrorMessage(null);
      setSuccessMessage('Savat muvaffaqiyatli o‘chirildi!');
      refetch();
    } catch (err: any) {
      console.error("O‘chirishda xato:", JSON.stringify(err, null, 2));
      setErrorMessage(err?.data?.message || 'Savat o‘chirishda xato yuz berdi!');
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
      <h2 className="text-2xl font-bold mb-4">Savatlar</h2>

      {errorMessage && (
        <div className="text-red-500 mb-4 p-2 bg-red-100 rounded">{errorMessage}</div>
      )}
      {successMessage && (
        <div className="text-green-500 mb-4 p-2 bg-green-100 rounded">{successMessage}</div>
      )}

      <div className="mb-6 p-4 bg-white rounded shadow">
        <h3 className="text-lg font-semibold mb-2">
          {editingCartId ? 'Savatni yangilash' : 'Yangi Savat'}
        </h3>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="number"
            placeholder="Foydalanuvchi ID kiriting"
            value={newCart.userId === 0 && !editingCartId ? '' : newCart.userId}
            onChange={(e) => setNewCart({ ...newCart, userId: Number(e.target.value) })}
            className="border p-2 rounded flex-1"
          />
          <input
            type="number"
            placeholder="Miqdorini kiriting"
            value={newCart.products[0].quantity === 0 && !editingCartId ? '' : newCart.products[0].quantity}
            onChange={(e) =>
              setNewCart({
                ...newCart,
                products: [{ ...newCart.products[0], quantity: Number(e.target.value) }],
              })
            }
            className="border p-2 rounded flex-1"
          />
        </div>
        <div className="mt-2 flex gap-2">
          {editingCartId ? (
            <>
              <button
                onClick={handleUpdateCart}
                className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600"
              >
                Yangilash
              </button>
              <button
                onClick={() => {
                  setNewCart({ userId: 0, products: [{ productId: 0, quantity: 0 }] });
                  setEditingCartId(null);
                }}
                className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
              >
                Bekor qilish
              </button>
            </>
          ) : (
            <button
              onClick={handleAddCart}
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Qo‘shish
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded shadow">
        <h3 className="text-lg font-semibold p-4">Savatlar ro‘yxati</h3>
        {carts.length === 0 ? (
          <p className="p-4 text-gray-500">Savatlar mavjud emas</p>
        ) : (
          <ul>
            {carts.map((cart) => (
              <li
                key={cart.id}
                className="flex items-center justify-between p-4 border-b hover:bg-gray-50"
              >
                <span>
                  Foydalanuvchi ID: {cart.userId}, Jami: ${cart.total}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditCart(cart)}
                    className="bg-yellow-500 text-white p-1 rounded hover:bg-yellow-600"
                  >
                    Tahrirlash
                  </button>
                  <button
                    onClick={() => handleDeleteCart(cart.id)}
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

export default Carts;
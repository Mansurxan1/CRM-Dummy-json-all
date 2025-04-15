import {
  useGetUsersQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from '../store/features/api/apiSlice';
import { useState } from 'react';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
}

interface ApiResponse {
  users: User[];
  total: number;
  skip: number;
  limit: number;
}

const Users = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  const skip = (page - 1) * limit;

  const { data, isLoading, error } = useGetUsersQuery({ limit, skip }) as {
    data: ApiResponse | undefined;
    isLoading: boolean;
    error: any;
  };
  const [addUser] = useAddUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const [newUser, setNewUser] = useState({ firstName: '', lastName: '', email: '', gender: '' });
  const [localUsers, setLocalUsers] = useState<User[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);

  const users: User[] = [...(data?.users || []), ...localUsers];
  const totalUsers = users.length;
  const maleUsers = users.filter((user) => user.gender.toLowerCase() === 'male').length;
  const femaleUsers = users.filter((user) => user.gender.toLowerCase() === 'female').length;
  const totalPages = Math.ceil((data?.total || 0) / limit);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleAddUser = async () => {
    if (!newUser.firstName || !newUser.email || !newUser.gender) {
      setErrorMessage("Iltimos, ism, email va jins maydonlarini to‘ldiring!");
      return;
    }
    if (!validateEmail(newUser.email)) {
      setErrorMessage("Iltimos, to‘g‘ri email manzil kiriting!");
      return;
    }
    if (!['male', 'female'].includes(newUser.gender.toLowerCase())) {
      setErrorMessage("Jins faqat 'Erkak' yoki 'Ayol' bo‘lishi mumkin!");
      return;
    }
    try {
      console.log("POST so‘rovi yuborilmoqda:", newUser);
      const response = await addUser(newUser).unwrap();
      console.log("API javobi:", response);
      const newUserData: User = {
        id: response.id || Date.now(),
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        gender: newUser.gender,
      };
      setLocalUsers((prev) => [...prev, newUserData]);
      setNewUser({ firstName: '', lastName: '', email: '', gender: '' });
      setErrorMessage(null);
      setSuccessMessage('Foydalanuvchi muvaffaqiyatli qo‘shildi!');
    } catch (err: any) {
      console.error("Qo‘shishda xato:", err);
      setErrorMessage(err?.data?.message || 'Foydalanuvchi qo‘shishda xato yuz berdi!');
    }
  };

  const handleEditUser = (user: User) => {
    setNewUser({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      gender: user.gender,
    });
    setEditingUserId(user.id);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleUpdateUser = async () => {
    if (!editingUserId) {
      setErrorMessage('Yangilash uchun foydalanuvchi tanlanmadi!');
      return;
    }
    if (!newUser.firstName || !newUser.email || !newUser.gender) {
      setErrorMessage("Iltimos, ism, email va jins maydonlarini to‘ldiring!");
      return;
    }
    if (!validateEmail(newUser.email)) {
      setErrorMessage("Iltimos, to‘g‘ri email manzil kiriting!");
      return;
    }
    if (!['male', 'female'].includes(newUser.gender.toLowerCase())) {
      setErrorMessage("Jins faqat 'Erkak' yoki 'Ayol' bo‘lishi mumkin!");
      return;
    }
    try {
      await updateUser({ id: editingUserId, ...newUser }).unwrap();
      setLocalUsers((prev) =>
        prev.map((user) =>
          user.id === editingUserId ? { ...user, ...newUser } : user
        )
      );
      setNewUser({ firstName: '', lastName: '', email: '', gender: '' });
      setEditingUserId(null);
      setErrorMessage(null);
      setSuccessMessage('Foydalanuvchi muvaffaqiyatli yangilandi!');
    } catch (err: any) {
      console.error("Yangilashda xato:", err);
      setErrorMessage(err?.data?.message || 'Foydalanuvchi yangilashda xato yuz berdi!');
    }
  };

  const handleDeleteUser = async (id: number) => {
    try {
      await deleteUser(id).unwrap();
      setLocalUsers((prev) => prev.filter((user) => user.id !== id));
      setErrorMessage(null);
      setSuccessMessage('Foydalanuvchi muvaffaqiyatli o‘chirildi!');
    } catch (err: any) {
      console.error("O‘chirishda xato:", err);
      setErrorMessage(err?.data?.message || 'Foydalanuvchi o‘chirishda xato yuz berdi!');
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
      <h2 className="text-2xl font-bold mb-4">Foydalanuvchilar</h2>

      {errorMessage && (
        <div className="text-red-500 mb-4 p-2 bg-red-100 rounded">{errorMessage}</div>
      )}
      {successMessage && (
        <div className="text-green-500 mb-4 p-2 bg-green-100 rounded">{successMessage}</div>
      )}

      <div className="mb-6 p-4 bg-gray-100 rounded shadow">
        <h3 className="text-xl font-semibold mb-2">Statistikalar</h3>
        <p className="text-lg">
          Jami foydalanuvchilar: <span className="font-bold">{totalUsers}</span>
        </p>
        <p className="text-lg">
          Erkaklar: <span className="font-bold">{maleUsers}</span>
        </p>
        <p className="text-lg">
          Ayollar: <span className="font-bold">{femaleUsers}</span>
        </p>
      </div>

      <div className="mb-6 p-4 bg-white rounded shadow">
        <h3 className="text-lg font-semibold mb-2">
          {editingUserId ? 'Foydalanuvchini yangilash' : 'Yangi Foydalanuvchi'}
        </h3>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Ism"
            value={newUser.firstName}
            onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
            className="border p-2 rounded flex-1"
          />
          <input
            type="text"
            placeholder="Familiya"
            value={newUser.lastName}
            onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
            className="border p-2 rounded flex-1"
          />
          <input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            className="border p-2 rounded flex-1"
          />
          <select
            value={newUser.gender}
            onChange={(e) => setNewUser({ ...newUser, gender: e.target.value })}
            className="border p-2 rounded flex-1"
          >
            <option value="">Jinsni tanlang</option>
            <option value="male">Erkak</option>
            <option value="female">Ayol</option>
          </select>
        </div>
        <div className="mt-2 flex gap-2">
          {editingUserId ? (
            <>
              <button
                onClick={handleUpdateUser}
                className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600"
              >
                Yangilash
              </button>
              <button
                onClick={() => {
                  setNewUser({ firstName: '', lastName: '', email: '', gender: '' });
                  setEditingUserId(null);
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
              >
                Bekor qilish
              </button>
            </>
          ) : (
            <button
              onClick={handleAddUser}
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Qo‘shish
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded shadow">
        <h3 className="text-lg font-semibold p-4">Foydalanuvchilar ro‘yxati</h3>
        {users.length === 0 ? (
          <p className="p-4 text-gray-500">Foydalanuvchilar mavjud emas</p>
        ) : (
          <ul>
            {users.map((user) => (
              <li
                key={user.id}
                className="flex items-center justify-between p-4 border-b hover:bg-gray-50"
              >
                <span>
                  {user.firstName} {user.lastName} ({user.email}, {user.gender})
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditUser(user)}
                    className="bg-yellow-500 text-white p-1 rounded hover:bg-yellow-600"
                  >
                    Tahrirlash
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
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

export default Users;
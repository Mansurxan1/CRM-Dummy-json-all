import {
  useGetUsersQuery,
  useLoginMutation,
} from "../store/features/api/apiSlice";
import { useState } from "react";

interface User {
  id: number;
  username: string;
  password: string;
}

const AuthLogin = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [login] = useLoginMutation();
  const { data, isLoading, error } = useGetUsersQuery({ limit: 10, skip: 0 }); 
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!credentials.username || !credentials.password) {
      setErrorMessage("Iltimos, barcha maydonlarni to‘ldiring!");
      return;
    }
    try {
      const response = await login(credentials).unwrap();
      setErrorMessage(null);
      setSuccessMessage("Kirish muvaffaqiyatli!");
      console.log("Kirish muvaffaqiyatli:", response);
      setCredentials({ username: "", password: "" });
    } catch (err: any) {
      console.error("Kirishda xato:", err);
      setErrorMessage(err?.data?.message || "Kirishda xato yuz berdi!");
    }
  };

  if (isLoading) return <div className="p-4">Yuklanmoqda...</div>;
  if (error) return <div className="p-4 text-red-500">Xato yuz berdi!</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Kirish</h2>

      {errorMessage && (
        <div className="text-red-500 mb-4 p-2 bg-red-100 rounded">
          {errorMessage}
        </div>
      )}
      {successMessage && (
        <div className="text-green-500 mb-4 p-2 bg-green-100 rounded">
          {successMessage}
        </div>
      )}

      <div className="mb-6 p-4 bg-white rounded shadow">
        <h3 className="text-lg font-semibold mb-2">Kirish</h3>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Foydalanuvchi nomi"
            value={credentials.username}
            onChange={(e) =>
              setCredentials({ ...credentials, username: e.target.value })
            }
            className="border p-2 rounded flex-1"
          />
          <input
            type="password"
            placeholder="Parol"
            value={credentials.password}
            onChange={(e) =>
              setCredentials({ ...credentials, password: e.target.value })
            }
            className="border p-2 rounded flex-1"
          />
        </div>
        <button
          onClick={handleLogin}
          className="mt-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Kirish
        </button>
      </div>

      <div className="bg-white rounded shadow">
        <h3 className="text-lg font-semibold p-4">Foydalanuvchilar</h3>
        {data?.users?.length === 0 ? (
          <p className="p-4 text-gray-500">Foydalanuvchilar mavjud emas</p>
        ) : (
          <ul>
            {data?.users?.slice(0, 10).map((user: User) => (
              <li
                key={user.id}
                className="p-4 border-b hover:bg-gray-50"
              >
                <span>
                  Username: {user.username}, Password: {user.password}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AuthLogin;
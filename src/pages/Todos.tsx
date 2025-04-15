import {
  useGetTodosQuery,
  useAddTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
} from '../store/features/api/apiSlice';
import { useState } from 'react';

interface Todo {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
}

interface ApiResponse {
  todos: Todo[];
  total: number;
  skip: number;
  limit: number;
}

const Todos = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  const skip = (page - 1) * limit;

  const { data, isLoading, error } = useGetTodosQuery({ limit, skip }) as {
    data: ApiResponse | undefined;
    isLoading: boolean;
    error: any;
  };
  const [addTodo] = useAddTodoMutation();
  const [updateTodo] = useUpdateTodoMutation();
  const [deleteTodo] = useDeleteTodoMutation();

  const [newTodo, setNewTodo] = useState({ todo: '', completed: false, userId: 0 });
  const [localTodos, setLocalTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);

  const todos: Todo[] = [...(data?.todos || []), ...localTodos];
  const totalPages = Math.ceil((data?.total || 0) / limit);

  const handleAddTodo = async () => {
    if (!newTodo.todo || newTodo.userId <= 0) {
      setErrorMessage("Iltimos, barcha maydonlarni to‘g‘ri to‘ldiring!");
      return;
    }
    try {
      console.log("POST so‘rovi yuborilmoqda:", newTodo);
      const response = await addTodo(newTodo).unwrap();
      console.log("API javobi:", response);
      const newTodoData: Todo = {
        id: response.id || Date.now(),
        todo: newTodo.todo,
        completed: newTodo.completed,
        userId: newTodo.userId,
      };
      setLocalTodos((prev) => [...prev, newTodoData]);
      setNewTodo({ todo: '', completed: false, userId: 0 });
      setErrorMessage(null);
      setSuccessMessage('Vazifa muvaffaqiyatli qo‘shildi!');
    } catch (err: any) {
      console.error("Qo‘shishda xato:", err);
      setErrorMessage(err?.data?.message || 'Vazifa qo‘shishda xato yuz berdi!');
    }
  };

  const handleEditTodo = (todo: Todo) => {
    setNewTodo({
      todo: todo.todo,
      completed: todo.completed,
      userId: todo.userId,
    });
    setEditingTodoId(todo.id);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleUpdateTodo = async () => {
    if (!editingTodoId) {
      setErrorMessage('Yangilash uchun vazifa tanlanmadi!');
      return;
    }
    if (!newTodo.todo || newTodo.userId <= 0) {
      setErrorMessage("Iltimos, barcha maydonlarni to‘g‘ri to‘ldiring!");
      return;
    }
    try {
      await updateTodo({ id: editingTodoId, ...newTodo }).unwrap();
      setLocalTodos((prev) =>
        prev.map((todo) =>
          todo.id === editingTodoId ? { ...todo, ...newTodo } : todo
        )
      );
      setNewTodo({ todo: '', completed: false, userId: 0 });
      setEditingTodoId(null);
      setErrorMessage(null);
      setSuccessMessage('Vazifa muvaffaqiyatli yangilandi!');
    } catch (err: any) {
      console.error("Yangilashda xato:", err);
      setErrorMessage(err?.data?.message || 'Vazifa yangilashda xato yuz berdi!');
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      await deleteTodo(id).unwrap();
      setLocalTodos((prev) => prev.filter((todo) => todo.id !== id));
      setErrorMessage(null);
      setSuccessMessage('Vazifa muvaffaqiyatli o‘chirildi!');
    } catch (err: any) {
      console.error("O‘chirishda xato:", err);
      setErrorMessage(err?.data?.message || 'Vazifa o‘chirishda xato yuz berdi!');
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
      <h2 className="text-2xl font-bold mb-4">Vazifalar</h2>

      {errorMessage && (
        <div className="text-red-500 mb-4 p-2 bg-red-100 rounded">{errorMessage}</div>
      )}
      {successMessage && (
        <div className="text-green-500 mb-4 p-2 bg-green-100 rounded">{successMessage}</div>
      )}

      <div className="mb-6 p-4 bg-white rounded shadow">
        <h3 className="text-lg font-semibold mb-2">
          {editingTodoId ? 'Vazifani yangilash' : 'Yangi Vazifa'}
        </h3>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Vazifa matnini kiriting"
            value={newTodo.todo}
            onChange={(e) => setNewTodo({ ...newTodo, todo: e.target.value })}
            className="border p-2 rounded flex-1"
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={newTodo.completed}
              onChange={(e) => setNewTodo({ ...newTodo, completed: e.target.checked })}
              className="h-5 w-5"
            />
            Bajardi
          </label>
          <input
            type="number"
            placeholder="Foydalanuvchi ID kiriting"
            value={newTodo.userId === 0 && !editingTodoId ? '' : newTodo.userId}
            onChange={(e) => setNewTodo({ ...newTodo, userId: Number(e.target.value) })}
            className="border p-2 rounded flex-1"
          />
        </div>
        <div className="mt-2 flex gap-2">
          {editingTodoId ? (
            <>
              <button
                onClick={handleUpdateTodo}
                className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600"
              >
                Yangilash
              </button>
              <button
                onClick={() => {
                  setNewTodo({ todo: '', completed: false, userId: 0 });
                  setEditingTodoId(null);
                }}
                className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
              >
                Bekor qilish
              </button>
            </>
          ) : (
            <button
              onClick={handleAddTodo}
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Qo‘shish
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded shadow">
        <h3 className="text-lg font-semibold p-4">Vazifalar ro‘yxati</h3>
        {todos.length === 0 ? (
          <p className="p-4 text-gray-500">Vazifalar mavjud emas</p>
        ) : (
          <ul>
            {todos.map((todo) => (
              <li
                key={todo.id}
                className="flex items-center justify-between p-4 border-b hover:bg-gray-50"
              >
                <span>
                  {todo.todo} (Foydalanuvchi ID: {todo.userId}, {todo.completed ? 'Bajardi' : 'Bajarilmadi'})
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditTodo(todo)}
                    className="bg-yellow-500 text-white p-1 rounded hover:bg-yellow-600"
                  >
                    Tahrirlash
                  </button>
                  <button
                    onClick={() => handleDeleteTodo(todo.id)}
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

export default Todos;
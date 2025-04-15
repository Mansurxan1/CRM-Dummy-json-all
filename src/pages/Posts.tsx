import {
  useGetPostsQuery,
  useAddPostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} from '../store/features/api/apiSlice';
import { useState } from 'react';

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

interface ApiResponse {
  posts: Post[];
  total: number;
  skip: number;
  limit: number;
}

const Posts = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  const skip = (page - 1) * limit;

  const { data, isLoading, error, refetch } = useGetPostsQuery({ limit, skip }) as {
    data: ApiResponse | undefined;
    isLoading: boolean;
    error: any;
    refetch: () => void;
  };
  const [addPost] = useAddPostMutation();
  const [updatePost] = useUpdatePostMutation();
  const [deletePost] = useDeletePostMutation();

  const [newPost, setNewPost] = useState({ title: '', body: '', userId: 0 });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [editingPostId, setEditingPostId] = useState<number | null>(null);

  const posts: Post[] = data?.posts || [];
  const totalPages = Math.ceil((data?.total || 0) / limit);

  const handleAddPost = async () => {
    if (!newPost.title || !newPost.body || newPost.userId <= 0) {
      setErrorMessage("Iltimos, barcha maydonlarni to‘g‘ri to‘ldiring!");
      return;
    }
    try {
      const payload = {
        title: newPost.title,
        body: newPost.body,
        userId: Number(newPost.userId),
      };
      console.log("POST so‘rovi yuborilmoqda:", payload);
      const response = await addPost(payload).unwrap();
      console.log("API javobi:", response);
      setNewPost({ title: '', body: '', userId: 0 });
      setErrorMessage(null);
      setSuccessMessage('Post muvaffaqiyatli qo‘shildi!');
      refetch();
    } catch (err: any) {
      console.error("Qo‘shishda xato:", JSON.stringify(err, null, 2));
      setErrorMessage(err?.data?.message || 'Post qo‘shishda xato yuz berdi!');
    }
  };

  const handleEditPost = (post: Post) => {
    setNewPost({
      title: post.title,
      body: post.body,
      userId: post.userId,
    });
    setEditingPostId(post.id);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleUpdatePost = async () => {
    if (!editingPostId) {
      setErrorMessage('Yangilash uchun post tanlanmadi!');
      return;
    }
    if (!newPost.title || !newPost.body || newPost.userId <= 0) {
      setErrorMessage("Iltimos, barcha maydonlarni to‘g‘ri to‘ldiring!");
      return;
    }
    try {
      const payload = {
        id: editingPostId,
        title: newPost.title,
        body: newPost.body,
        userId: Number(newPost.userId),
      };
      await updatePost(payload).unwrap();
      setNewPost({ title: '', body: '', userId: 0 });
      setEditingPostId(null);
      setErrorMessage(null);
      setSuccessMessage('Post muvaffaqiyatli yangilandi!');
      refetch();
    } catch (err: any) {
      console.error("Yangilashda xato:", JSON.stringify(err, null, 2));
      setErrorMessage(err?.data?.message || 'Post yangilashda xato yuz berdi!');
    }
  };

  const handleDeletePost = async (id: number) => {
    try {
      await deletePost(id).unwrap();
      setErrorMessage(null);
      setSuccessMessage('Post muvaffaqiyatli o‘chirildi!');
      refetch();
    } catch (err: any) {
      console.error("O‘chirishda xato:", JSON.stringify(err, null, 2));
      setErrorMessage(err?.data?.message || 'Post o‘chirishda xato yuz berdi!');
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
      <h2 className="text-2xl font-bold mb-4">Postlar</h2>

      {errorMessage && (
        <div className="text-red-500 mb-4 p-2 bg-red-100 rounded">{errorMessage}</div>
      )}
      {successMessage && (
        <div className="text-green-500 mb-4 p-2 bg-green-100 rounded">{successMessage}</div>
      )}

      <div className="mb-6 p-4 bg-white rounded shadow">
        <h3 className="text-lg font-semibold mb-2">
          {editingPostId ? 'Postni yangilash' : 'Yangi Post'}
        </h3>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Post sarlavhasini kiriting"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            className="border p-2 rounded flex-1"
          />
          <textarea
            placeholder="Post matnini kiriting"
            value={newPost.body}
            onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
            className="border p-2 rounded flex-1"
          />
          <input
            type="number"
            placeholder="Foydalanuvchi ID kiriting"
            value={newPost.userId === 0 && !editingPostId ? '' : newPost.userId}
            onChange={(e) => setNewPost({ ...newPost, userId: Number(e.target.value) })}
            className="border p-2 rounded flex-1"
          />
        </div>
        <div className="mt-2 flex gap-2">
          {editingPostId ? (
            <>
              <button
                onClick={handleUpdatePost}
                className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600"
              >
                Yangilash
              </button>
              <button
                onClick={() => {
                  setNewPost({ title: '', body: '', userId: 0 });
                  setEditingPostId(null);
                }}
                className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
              >
                Bekor qilish
              </button>
            </>
          ) : (
            <button
              onClick={handleAddPost}
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Qo‘shish
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded shadow">
        <h3 className="text-lg font-semibold p-4">Postlar ro‘yxati</h3>
        {posts.length === 0 ? (
          <p className="p-4 text-gray-500">Postlar mavjud emas</p>
        ) : (
          <ul>
            {posts.map((post) => (
              <li
                key={post.id}
                className="flex items-center justify-between p-4 border-b hover:bg-gray-50"
              >
                <span>
                  {post.title} (Foydalanuvchi ID: {post.userId}) - {post.body}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditPost(post)}
                    className="bg-yellow-500 text-white p-1 rounded hover:bg-yellow-600"
                  >
                    Tahrirlash
                  </button>
                  <button
                    onClick={() => handleDeletePost(post.id)}
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

export default Posts;
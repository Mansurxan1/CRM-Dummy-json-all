import {
  useGetCommentsQuery,
  useAddCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
} from '../store/features/api/apiSlice';
import { useState } from 'react';

interface Comment {
  id: number;
  body: string;
  postId: number;
  user: { id: number; username: string };
}

interface ApiResponse {
  comments: Comment[];
  total: number;
  skip: number;
  limit: number;
}

const Comments = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  const skip = (page - 1) * limit;

  const { data, isLoading, error } = useGetCommentsQuery({ limit, skip }) as {
    data: ApiResponse | undefined;
    isLoading: boolean;
    error: any;
  };
  const [addComment] = useAddCommentMutation();
  const [updateComment] = useUpdateCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();

  const [newComment, setNewComment] = useState({ body: '', postId: 0, userId: 0 });
  const [localComments, setLocalComments] = useState<Comment[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);

  const comments: Comment[] = [...(data?.comments || []), ...localComments];
  const totalPages = Math.ceil((data?.total || 0) / limit);

  const handleAddComment = async () => {
    if (!newComment.body || newComment.postId <= 0 || newComment.userId <= 0) {
      setErrorMessage("Iltimos, barcha maydonlarni to‘g‘ri to‘ldiring!");
      return;
    }
    try {
      const payload = {
        body: newComment.body,
        postId: newComment.postId,
        userId: newComment.userId,
      };
      console.log("POST so‘rovi yuborilmoqda:", payload);
      const response = await addComment(payload).unwrap();
      console.log("API javobi:", response);
      const newCommentData: Comment = {
        id: response.id || Date.now(),
        body: newComment.body,
        postId: newComment.postId,
        user: { id: newComment.userId, username: `user-${newComment.userId}` },
      };
      setLocalComments((prev) => [...prev, newCommentData]);
      setNewComment({ body: '', postId: 0, userId: 0 });
      setErrorMessage(null);
      setSuccessMessage('Komment muvaffaqiyatli qo‘shildi!');
    } catch (err: any) {
      console.error("Qo‘shishda xato:", err);
      setErrorMessage(err?.data?.message || 'Komment qo‘shishda xato yuz berdi!');
    }
  };

  const handleEditComment = (comment: Comment) => {
    setNewComment({
      body: comment.body,
      postId: comment.postId,
      userId: comment.user.id,
    });
    setEditingCommentId(comment.id);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleUpdateComment = async () => {
    if (!editingCommentId) {
      setErrorMessage('Yangilash uchun komment tanlanmadi!');
      return;
    }
    if (!newComment.body || newComment.postId <= 0 || newComment.userId <= 0) {
      setErrorMessage("Iltimos, barcha maydonlarni to‘g‘ri to‘ldiring!");
      return;
    }
    try {
      const payload = {
        body: newComment.body,
        postId: newComment.postId,
        userId: newComment.userId,
      };
      await updateComment({ id: editingCommentId, ...payload }).unwrap();
      setLocalComments((prev) =>
        prev.map((comment) =>
          comment.id === editingCommentId
            ? {
                ...comment,
                body: newComment.body,
                postId: newComment.postId,
                user: { id: newComment.userId, username: `user-${newComment.userId}` },
              }
            : comment
        )
      );
      setNewComment({ body: '', postId: 0, userId: 0 });
      setEditingCommentId(null);
      setErrorMessage(null);
      setSuccessMessage('Komment muvaffaqiyatli yangilandi!');
    } catch (err: any) {
      console.error("Yangilashda xato:", err);
      setErrorMessage(err?.data?.message || 'Komment yangilashda xato yuz berdi!');
    }
  };

  const handleDeleteComment = async (id: number) => {
    try {
      await deleteComment(id).unwrap();
      setLocalComments((prev) => prev.filter((comment) => comment.id !== id));
      setErrorMessage(null);
      setSuccessMessage('Komment muvaffaqiyatli o‘chirildi!');
    } catch (err: any) {
      console.error("O‘chirishda xato:", err);
      setErrorMessage(err?.data?.message || 'Komment o‘chirishda xato yuz berdi!');
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
      <h2 className="text-2xl font-bold mb-4">Kommentlar</h2>

      {errorMessage && (
        <div className="text-red-500 mb-4 p-2 bg-red-100 rounded">{errorMessage}</div>
      )}
      {successMessage && (
        <div className="text-green-500 mb-4 p-2 bg-green-100 rounded">{successMessage}</div>
      )}

      <div className="mb-6 p-4 bg-white rounded shadow">
        <h3 className="text-lg font-semibold mb-2">
          {editingCommentId ? 'Kommentni yangilash' : 'Yangi Komment'}
        </h3>
        <div className="flex flex-col sm:flex-row gap-2">
          <textarea
            placeholder="Komment matnini kiriting"
            value={newComment.body}
            onChange={(e) => setNewComment({ ...newComment, body: e.target.value })}
            className="border p-2 rounded flex-1"
          />
          <input
            type="number"
            placeholder="Post ID kiriting"
            value={newComment.postId === 0 && !editingCommentId ? '' : newComment.postId}
            onChange={(e) => setNewComment({ ...newComment, postId: Number(e.target.value) })}
            className="border p-2 rounded flex-1"
          />
          <input
            type="number"
            placeholder="Foydalanuvchi ID kiriting"
            value={newComment.userId === 0 && !editingCommentId ? '' : newComment.userId}
            onChange={(e) => setNewComment({ ...newComment, userId: Number(e.target.value) })}
            className="border p-2 rounded flex-1"
          />
        </div>
        <div className="mt-2 flex gap-2">
          {editingCommentId ? (
            <>
              <button
                onClick={handleUpdateComment}
                className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600"
              >
                Yangilash
              </button>
              <button
                onClick={() => {
                  setNewComment({ body: '', postId: 0, userId: 0 });
                  setEditingCommentId(null);
                }}
                className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
              >
                Bekor qilish
              </button>
            </>
          ) : (
            <button
              onClick={handleAddComment}
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Qo‘shish
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded shadow">
        <h3 className="text-lg font-semibold p-4">Kommentlar ro‘yxati</h3>
        {comments.length === 0 ? (
          <p className="p-4 text-gray-500">Kommentlar mavjud emas</p>
        ) : (
          <ul>
            {comments.map((comment) => (
              <li
                key={comment.id}
                className="flex items-center justify-between p-4 border-b hover:bg-gray-50"
              >
                <span>
                  {comment.body} (Post ID: {comment.postId}, Foydalanuvchi: {comment.user.username})
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditComment(comment)}
                    className="bg-yellow-500 text-white p-1 rounded hover:bg-yellow-600"
                  >
                    Tahrirlash
                  </button>
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
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

export default Comments;
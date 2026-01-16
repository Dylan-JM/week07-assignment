import { useEffect, useState } from "react";
import { useParams } from "react-router";

export default function ViewPost() {
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");

  useEffect(() => {
    async function loadPost() {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/ViewPost/${id}`
      );
      const data = await response.json();
      setPost(data);
    }

    async function loadComments() {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/comments/${id}`
      );
      const data = await response.json();
      setComments(data);
    }

    loadPost();
    loadComments();
  }, [id]);

  async function submitComment(event) {
    event.preventDefault();

    await fetch(`${import.meta.env.VITE_SERVER_URL}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        postId: id,
        userId: user.id,
        content: content,
      }),
    });

    setContent("");

    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/comments/${id}`
    );
    const data = await response.json();
    setComments(data);
  }

  if (!post) return null;

  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-10 flex justify-center">
      <div className="max-w-2xl w-full flex flex-col gap-8">
        <div className="bg-gray-900 p-8 rounded-md flex flex-col gap-6">
          <h1 className="text-3xl font-semibold">{post.title}</h1>

          {post.image_url && (
            <img
              src={post.image_url}
              className="w-full rounded-md object-cover"
            />
          )}

          <p className="text-gray-300">{post.content}</p>

          <div className="text-sm text-gray-400">By {post.username}</div>
        </div>

        <form onSubmit={submitComment} className="flex gap-3">
          <input
            type="text"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Write a comment..."
            className="flex-1 px-3 py-2 bg-gray-800 rounded-md border border-gray-700 outline-none"
          />
          <button className="px-4 bg-purple-600 rounded-md hover:bg-purple-700">
            Send
          </button>
        </form>

        <div className="flex flex-col gap-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-gray-900 p-4 rounded-md border border-gray-800"
            >
              <div className="flex justify-between text-sm text-gray-400">
                <span>{comment.username}</span>
                <span>{new Date(comment.created_at).toLocaleString()}</span>
              </div>

              <div className="text-gray-300">{comment.content}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

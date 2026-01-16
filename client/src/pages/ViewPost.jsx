import { useEffect, useState } from "react";
import { useParams } from "react-router";

export default function ViewPost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    async function fetchPost() {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/ViewPost/${id}`
      );
      const data = await response.json();
      setPost(data);
    }
    fetchPost();
  }, [id]);

  if (!post) return null;

  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-10 flex justify-center">
      <div className="max-w-2xl w-full bg-gray-900 p-8 rounded-xl flex flex-col gap-6">
        <h1 className="text-3xl font-semibold">{post.title}</h1>

        {post.image_url && (
          <img
            src={post.image_url}
            alt=""
            className="w-full rounded-lg object-cover"
          />
        )}

        <p className="text-gray-300 leading-relaxed">{post.content}</p>

        <div className="flex justify-between text-sm text-gray-400">
          <span>{post.category}</span>
          <span>By {post.username}</span>
        </div>
      </div>
    </div>
  );
}

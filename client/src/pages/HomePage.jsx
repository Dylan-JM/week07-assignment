import { useEffect, useState } from "react";
import { Link } from "react-router";

export default function HomePage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function loadPosts() {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/posts`);
      const data = await response.json();
      setPosts(data);
    }
    loadPosts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-10">
      <div className="max-w-3xl mx-auto flex flex-col gap-6">
        <h1 className="text-2xl font-semibold">Latest Posts</h1>

        {posts.map((post) => (
          <Link
            to={`/ViewPost/${post.id}`}
            key={post.id}
            className="bg-gray-900 p-6 rounded-md border border-gray-800 hover:border-purple-500 transition flex flex-col gap-3"
          >
            <h2 className="text-xl font-medium">{post.title}</h2>

            {post.image_url && (
              <img
                src={post.image_url}
                alt=""
                className="w-full h-60 object-cover rounded-md"
              />
            )}

            <p className="text-gray-300 line-clamp-3">{post.content}</p>

            <div className="flex justify-between text-sm text-gray-400">
              <span>{post.category}</span>
              <span>By {post.username}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { Link, useParams } from "react-router";

export default function UserProfile() {
  const { userId } = useParams(); // <-- dynamic user ID from URL
  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  const [activeTab, setActiveTab] = useState("posts");
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    async function loadData() {
      const postsResponse = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/user-posts/${userId}`
      );
      const postsData = await postsResponse.json();
      setPosts(postsData);

      const commentsResponse = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/user-comments/${userId}`
      );
      const commentsData = await commentsResponse.json();
      setComments(commentsData);
    }

    loadData();
  }, [userId]);

  if (!loggedInUser) {
    return (
      <div className="text-white p-6">
        You must be logged in to view profiles.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <h1 className="text-3xl font-semibold mb-6">User {userId}'s Profile</h1>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("posts")}
          className={`px-4 py-2 rounded-md ${
            activeTab === "posts" ? "bg-purple-600" : "bg-gray-800"
          }`}
        >
          Posts
        </button>

        <button
          onClick={() => setActiveTab("comments")}
          className={`px-4 py-2 rounded-md ${
            activeTab === "comments" ? "bg-purple-600" : "bg-gray-800"
          }`}
        >
          Comments
        </button>
      </div>

      {activeTab === "posts" && (
        <div className="flex flex-col gap-4">
          {posts.length === 0 && <p className="text-gray-400">No posts yet.</p>}
          {posts.map((post) => (
            <div key={post.id} className="bg-gray-900 p-4 rounded-md">
              <Link to={`/ViewPost/${post.id}`}>
                <h2>{post.title}</h2>
              </Link>
              <p className="text-gray-400">{post.content}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === "comments" && (
        <div className="flex flex-col gap-4">
          {comments.length === 0 && (
            <p className="text-gray-400">No comments yet.</p>
          )}
          {comments.map((comment) => (
            <div key={comment.id} className="bg-gray-900 p-4 rounded-md">
              <Link to={`/ViewPost/${comment.post_id}`}>
                <p>{comment.content}</p>
                <p className="text-sm text-gray-500">
                  On: {comment.post_title}
                </p>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

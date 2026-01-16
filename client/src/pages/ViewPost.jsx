import { useEffect, useState } from "react";
import { useParams } from "react-router";

export default function ViewPost() {
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const [postLikes, setPostLikes] = useState(0);
  const [postLiked, setPostLiked] = useState(false);
  const [commentLikes, setCommentLikes] = useState({});

  useEffect(() => {
    (async () => {
      const postResponse = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/ViewPost/${id}`
      );
      const postData = await postResponse.json();

      const commentsResponse = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/comments/${id}`
      );
      const commentsData = await commentsResponse.json();

      const postLikesResponse = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/post-likes/${id}`
      );
      const postLikesData = await postLikesResponse.json();

      let postLikedData = { liked: false };
      const commentLikesMap = {};

      if (user) {
        const postLikedResponse = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/post-liked/${id}/${user.id}`
        );
        postLikedData = await postLikedResponse.json();
      }

      for (const comment of commentsData) {
        const countResponse = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/comment-likes/${comment.id}`
        );
        const countData = await countResponse.json();

        let liked = false;

        if (user) {
          const likedResponse = await fetch(
            `${import.meta.env.VITE_SERVER_URL}/comment-liked/${comment.id}/${
              user.id
            }`
          );
          const likedData = await likedResponse.json();
          liked = likedData.liked;
        }

        commentLikesMap[comment.id] = {
          count: countData.likes,
          liked,
        };
      }

      setPost(postData);
      setComments(commentsData);
      setPostLikes(postLikesData.likes);
      setPostLiked(postLikedData.liked);
      setCommentLikes(commentLikesMap);
    })();
  }, [id, user, user?.id]);

  async function submitComment(event) {
    event.preventDefault();

    if (!user) {
      alert("You must be logged in to post a comment.");
      return;
    }

    await fetch(`${import.meta.env.VITE_SERVER_URL}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        postId: id,
        userId: user.id,
        content: commentInput,
      }),
    });

    setCommentInput("");

    const commentsResponse = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/comments/${id}`
    );
    const commentsData = await commentsResponse.json();
    setComments(commentsData);
  }

  async function togglePostLike() {
    if (!user) return;

    const route = postLiked ? "unlike-post" : "like-post";

    await fetch(`${import.meta.env.VITE_SERVER_URL}/${route}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId: id, userId: user.id }),
    });

    setPostLiked(!postLiked);
    setPostLikes((previous) => previous + (postLiked ? -1 : 1));
  }

  async function toggleCommentLike(commentId) {
    if (!user) return;

    const current = commentLikes[commentId];
    const route = current.liked ? "unlike-comment" : "like-comment";

    await fetch(`${import.meta.env.VITE_SERVER_URL}/${route}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ commentId, userId: user.id }),
    });

    setCommentLikes((previous) => ({
      ...previous,
      [commentId]: {
        liked: !current.liked,
        count: current.count + (current.liked ? -1 : 1),
      },
    }));
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

          <div className="flex items-center justify-between text-sm text-gray-400">
            <button
              onClick={togglePostLike}
              className="text-red-500 text-sm hover:text-red-400"
            >
              {postLiked ? "💔" : "❤️"} {postLikes}
            </button>

            <span>By {post.username}</span>
          </div>
        </div>

        <form onSubmit={submitComment} className="flex gap-3">
          <input
            type="text"
            value={commentInput}
            onChange={(event) => setCommentInput(event.target.value)}
            placeholder="Write a comment..."
            className="flex-1 px-3 py-2 bg-gray-800 rounded-md border border-gray-700 outline-none"
          />
          <button className="px-4 bg-purple-600 rounded-md hover:bg-purple-700">
            Send
          </button>
        </form>

        <div className="flex flex-col gap-4">
          {comments.map((commentItem) => (
            <div
              key={commentItem.id}
              className="bg-gray-900 p-4 rounded-md border border-gray-800"
            >
              <div className="text-sm text-gray-400 mb-1">
                {commentItem.username}
              </div>

              <div className="text-gray-300 mb-2">{commentItem.content}</div>

              <div className="flex justify-between items-center text-xs text-gray-500">
                <button
                  onClick={() => toggleCommentLike(commentItem.id)}
                  className="text-red-500 hover:text-red-400"
                >
                  {commentLikes[commentItem.id]?.liked ? "💔" : "❤️"}{" "}
                  {commentLikes[commentItem.id]?.count ?? 0}
                </button>

                <span>{new Date(commentItem.created_at).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

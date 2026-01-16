import { Link } from "react-router";

export default function Header() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <header className="bg-gray-900 text-white">
      <nav className="w-full px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-6 h-6 bg-purple-500 rounded-full" />
          <span className="text-lg font-semibold tracking-wide">MyApp</span>
        </Link>

        <div className="flex items-center gap-8 text-sm font-medium">
          <Link to="/" className="hover:text-purple-400 transition">
            Home
          </Link>
          <Link to="/CreatePost" className="hover:text-purple-400 transition">
            Create Post
          </Link>
        </div>

        {user ? (
          <Link to="/UserProfile">
            <p>{user.username}</p>
          </Link>
        ) : (
          <Link
            to="/LoginSignUp"
            className="text-sm font-medium hover:text-purple-400 transition"
          >
            Log in →
          </Link>
        )}
      </nav>
    </header>
  );
}

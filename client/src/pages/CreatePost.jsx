import { useState } from "react";

export default function CreatePost() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [formValues, setFormValues] = useState({
    title: "",
    content: "",
    category: "",
    image_url: "",
  });

  function handleChange(event) {
    setFormValues({ ...formValues, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/create-post`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          title: formValues.title,
          content: formValues.content,
          category: formValues.category,
          image_url: formValues.image_url,
        }),
      }
    );

    const data = await response.json();

    if (data.post) {
      window.location.href = `/ViewPost/${data.post.id}`;
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-gray-900 p-8 rounded-xl shadow-lg flex flex-col gap-6"
      >
        <h1 className="text-2xl font-semibold tracking-wide">Create a Post</h1>

        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formValues.title}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 focus:border-purple-500 outline-none"
        />

        <textarea
          name="content"
          placeholder="Content"
          value={formValues.content}
          onChange={handleChange}
          rows="5"
          className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 focus:border-purple-500 outline-none"
        />

        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formValues.category}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 focus:border-purple-500 outline-none"
        />

        <input
          type="text"
          name="image_url"
          placeholder="Image URL (Optional)"
          value={formValues.image_url}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 focus:border-purple-500 outline-none"
        />

        <button
          type="submit"
          className="w-full py-2 bg-purple-600 hover:bg-purple-700 rounded-md font-medium transition"
        >
          Post
        </button>
      </form>
    </div>
  );
}

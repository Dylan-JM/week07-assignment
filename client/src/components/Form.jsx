import { useState } from "react";

export function Form() {
  const [mode, setMode] = useState("login");

  const [formValues, setFormValues] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

  async function handleSubmit(event) {
    event.preventDefault();

    if (mode === "signup") {
      try {
        await fetch(`${import.meta.env.VITE_SERVER_URL}/new-user`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: formValues.username,
            password: formValues.password,
          }),
        });
      } catch (error) {
        console.error("Error:", error);
      }
    }

    if (mode === "login") {
      localStorage.setItem(
        "user",
        JSON.stringify({
          username: formValues.username,
          avatar: null,
        })
      );
    }

    window.location.href = "/";
  }

  function handleInputChange(event) {
    setFormValues({
      ...formValues,
      [event.target.name]: event.target.value,
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-center gap-6 mb-4">
        <button
          type="button"
          onClick={() => setMode("login")}
          className={`px-3 py-1.5 rounded-md text-sm font-semibold transition ${
            mode === "login"
              ? "bg-indigo-500 text-white"
              : "bg-white/5 text-gray-300 hover:bg-white/10"
          }`}
        >
          Login
        </button>

        <button
          type="button"
          onClick={() => setMode("signup")}
          className={`px-3 py-1.5 rounded-md text-sm font-semibold transition ${
            mode === "signup"
              ? "bg-indigo-500 text-white"
              : "bg-white/5 text-gray-300 hover:bg-white/10"
          }`}
        >
          Sign Up
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-100"
          >
            Username
          </label>
          <div className="mt-2">
            <input
              type="text"
              id="username"
              name="username"
              value={formValues.username}
              onChange={handleInputChange}
              className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:outline-indigo-500"
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-100"
          >
            Password
          </label>
          <div className="mt-2">
            <input
              type="password"
              id="password"
              name="password"
              value={formValues.password}
              onChange={handleInputChange}
              className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:outline-indigo-500"
            />
          </div>
        </div>
        {mode === "signup" && (
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-100"
            >
              Confirm Password
            </label>
            <div className="mt-2">
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formValues.confirmPassword}
                onChange={handleInputChange}
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:outline-indigo-500"
              />
            </div>
          </div>
        )}
        <button
          type="submit"
          className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-indigo-500"
        >
          {mode === "login" ? "Login" : "Create Account"}
        </button>
      </form>
    </div>
  );
}

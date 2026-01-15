import { useState } from "react";

export function Form() {
  const [formValues, setFormValues] = useState({
    username: "",
    password: "",
  });

  function handleSubmit(event) {
    event.preventDefault();
    console.log("The form values are", formValues);
  }

  function handleInputChange(event) {
    setFormValues({
      ...formValues,
      [event.target.name]: event.target.value,
    });
  }

  return (
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
            className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline outline-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:outline-indigo-500"
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
            className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline outline-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:outline-indigo-500"
          />
        </div>
      </div>

      <button
        type="submit"
        className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-indigo-500"
      >
        Submit
      </button>
    </form>
  );
}

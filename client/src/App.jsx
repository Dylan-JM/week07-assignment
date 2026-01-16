import { Routes, Route } from "react-router";
import HomePage from "./pages/HomePage";
import CreatePost from "./pages/CreatePost";
import ViewPost from "./pages/ViewPost";
import LoginSignUp from "./pages/LoginSignUp";
import UserProfile from "./pages/UserProfile";
import Layout from "./components/Layout";
import "./App.css";

export default function App() {
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route element={<HomePage />} path={"/"} />
          <Route element={<CreatePost />} path={"/CreatePost"} />
          <Route element={<ViewPost />} path={"/ViewPost/:id"} />
          <Route element={<LoginSignUp />} path={"/LoginSignUp"} />
          <Route element={<UserProfile />} path={"/UserProfile"} />
        </Route>
      </Routes>
    </>
  );
}

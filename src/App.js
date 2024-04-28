import React from "react";
import { useRoutes, useLocation } from "react-router-dom";
import ReadPosts from "./pages/ReadPosts";
import CreatePost from "./pages/CreatePost";
import EditPost from "./pages/EditPost";
// import UserProfile from "./pages/UserProfile";
import Login from "./pages/Login";
import ViewPost from "./pages/ViewPost";
import { Link } from "react-router-dom";
import "./App.css";

const App = () => {
  const location = useLocation();
  const hideHeader = location.pathname === "/login";

  let element = useRoutes([
    {
      path: "/",
      element: <ReadPosts />,
    },
    {
      path: "/edit/:id",
      element: <EditPost />,
    },
    {
      path: "/new",
      element: <CreatePost />,
    },
    // {
    //   path: "/profile",
    //   element: <UserProfile />,
    // },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/viewPost/:id", 
      element: <ViewPost />,
    },
  ]);

  return (
    <div className="App">
      {!hideHeader && (
        <nav className="navbar">
          <ul className="nav-links">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/new">Create Post</Link>
            </li>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
          </ul>
        </nav>
      )}
      <div className="content">
        <div className="logo">
          <img src="/boldredlogo.png" alt="Twisted Lit" />
        </div>
        {/* {!hideHeader && (
          <div className="circleButton">
            <Link to="/profile">
              <img src="/default.jpeg" alt="Profile" />
            </Link>
          </div>
        )} */}
        {element}
      </div>
    </div>
  );
};

export default App;

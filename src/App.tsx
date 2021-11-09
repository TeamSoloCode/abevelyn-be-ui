import React from "react";
import { Link, Outlet } from "react-router-dom";

export const App = (props) => {
  return (
    <div>
      <header>asdasd</header>
      <div>
        <ul>
          <li>
            <Link to="/home">Home</Link>
          </li>
          <li>
            <Link to="/collection">Collection</Link>
          </li>
        </ul>
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
};

import React from "react";
import { Outlet } from "react-router";
import { TopBar } from "../components/topbar";

export const HomePage = React.memo(() => {
  return (
    <div className="home">
      <TopBar />
      <div className="home__content">
        <Outlet />
      </div>
    </div>
  );
});

import React from "react";
import { Outlet } from "react-router";
import { TopBar } from "../components/topbar";

export const HomePage = React.memo(() => {
  return (
    <div>
      <TopBar />
      <Outlet />
    </div>
  );
});

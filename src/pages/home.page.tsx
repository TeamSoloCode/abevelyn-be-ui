import React from "react";
import { Outlet } from "react-router";
import { TopBar } from "../components/topbar";
import { ColorContextProvider } from "../context/colors.context";

export const HomePage = React.memo(() => {
  return (
    <div className="home">
      <TopBar />
      <div className="home__content">
        <ColorContextProvider>
          <Outlet />
        </ColorContextProvider>
      </div>
    </div>
  );
});

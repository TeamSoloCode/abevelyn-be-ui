import React from "react";
import { Outlet } from "react-router";
import { TopBar } from "../components/topbar";
import { CollectionContextProvider } from "../context/collection.context";
import { ColorContextProvider } from "../context/colors.context";

export const HomePage = React.memo(() => {
  return (
    <div className="home">
      <TopBar />
      <div className="home__content">
        <ColorContextProvider>
          <CollectionContextProvider>
            <Outlet />
          </CollectionContextProvider>
        </ColorContextProvider>
      </div>
    </div>
  );
});

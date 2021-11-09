import React from "react";
import ReactDOM from "react-dom";
import "./sass/main.scss";
import { App } from "./App";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { HomePage } from "./pages/home.page";
import { CollectionPage } from "./pages/collection.page";
import { AppRoutes } from "./constanst";
import { AppContextProvider } from "./context/app.context";
import { SignInPage } from "./pages/signin.page";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <AppContextProvider>
        <Routes>
          <Route path={`/${AppRoutes.SIGNIN}`} element={<SignInPage />} />
          <Route path="/" element={<App />}>
            <Route path={AppRoutes.HOME} element={<HomePage />} />
            <Route path={AppRoutes.COLLECTIONS} element={<CollectionPage />} />
          </Route>
        </Routes>
      </AppContextProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

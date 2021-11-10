import React, { useContext, useEffect, useRef } from "react";
import { Navigate, Route, Routes, useNavigate, useLocation } from "react-router";
import { AppRoutes } from "./constanst";
import AppContext from "./context/app.context";
import { CollectionPage } from "./pages/collection.page";
import { HomePage } from "./pages/home.page";
import { SignInPage } from "./pages/signin.page";

export const App = (props) => {
  const navigate = useNavigate();
  const appContext = useContext(AppContext);
  const { authenticated } = appContext.state;

  useEffect(() => {
    if (authenticated == false) {
      navigate(`/${AppRoutes.SIGNIN}`);
    } else if (authenticated == undefined) {
      // TODO navigate to loading page
    }
  }, [authenticated]);

  return (
    <div>
      <Routes>
        <Route path={`/${AppRoutes.SIGNIN}`} element={<SignInPage />} />
        <Route path="/" element={<HomePage />}>
          <Route path={AppRoutes.COLLECTIONS} element={<CollectionPage />} />
          <Route path={AppRoutes.PRODUCTS} element={<CollectionPage />} />
          <Route path={AppRoutes.COLORS} element={<CollectionPage />} />
        </Route>
      </Routes>
    </div>
  );
};

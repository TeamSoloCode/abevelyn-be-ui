import React, { useContext, useEffect, useRef } from "react";
import Spinner from "react-bootstrap/Spinner";
import { Navigate, Route, Routes, useNavigate, useLocation } from "react-router";
import { AppRoutes } from "./constanst";
import AppContext from "./context/app.context";
import { HomePage } from "./pages/home.page";
import { SignInPage } from "./pages/signin.page";
import { ToastContainer } from "react-toastify";
import { routes } from "./routes";

export const App = (props) => {
  const navigate = useNavigate();
  const appContext = useContext(AppContext);
  const { authenticated } = appContext.state;

  useEffect(() => {
    if (authenticated == false) {
      navigate(`/${AppRoutes.SIGNIN}`);
    }
  }, [authenticated]);

  return (
    <div className="text-center">
      {authenticated == undefined && <Spinner animation="border" variant="success" />}
      <Routes>
        <Route path={`/${AppRoutes.SIGNIN}`} element={<SignInPage />} />
        {authenticated && (
          <Route path="/" element={<HomePage />}>
            {routes.map((route) => (
              <Route key={route.path} {...route} />
            ))}
          </Route>
        )}
      </Routes>
      <ToastContainer />
    </div>
  );
};

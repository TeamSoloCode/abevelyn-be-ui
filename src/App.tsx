import React, { useContext, useEffect, useRef } from "react";
import Spinner from "react-bootstrap/Spinner";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppRoutes } from "./constanst";
import AppContext from "./context/app.context";
import { HomePage } from "./pages/home.page";
import { SignInPage } from "./pages/signin.page";
import { ToastContainer } from "react-toastify";
import { ProductsPage } from "./pages/product/products.page";
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
    <div className="">
      {authenticated == undefined && <Spinner animation="border" variant="success" />}
      <Routes>
        <Route path={`/${AppRoutes.SIGNIN}`} element={<SignInPage />} />
        {authenticated && <Route path="/*" element={<HomePage />} />}
      </Routes>
      <ToastContainer />
    </div>
  );
};

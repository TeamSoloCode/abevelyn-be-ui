import React, { useContext, useEffect, useRef } from "react";
import Spinner from "react-bootstrap/Spinner";
import { Navigate, Route, Routes, useNavigate, useLocation } from "react-router";
import { AppRoutes } from "./constanst";
import AppContext from "./context/app.context";
import { CollectionPage } from "./pages/collection.page";
import { ColorsPage } from "./pages/colors.page";
import { HomePage } from "./pages/home.page";
import { ProductStatusPage } from "./pages/product-status.page";
import { ProductsPage } from "./pages/products.page";
import { SignInPage } from "./pages/signin.page";
import { SizePage } from "./pages/sizes.page";
import { ToastContainer } from "react-toastify";
import { ColorContextProvider } from "./context/colors.context";
import { CollectionContextProvider } from "./context/collection.context";
import { ProductStatusContextProvider } from "./context/product-status.context";
import { SizeContextProvider } from "./context/size.context";

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
            <Route
              path={AppRoutes.COLLECTIONS}
              element={
                <CollectionContextProvider>
                  <CollectionPage />
                </CollectionContextProvider>
              }
            />
            <Route path={AppRoutes.PRODUCTS} element={<ProductsPage />} />
            <Route
              path={AppRoutes.COLORS}
              element={
                <ColorContextProvider>
                  <ColorsPage />
                </ColorContextProvider>
              }
            />
            <Route
              path={AppRoutes.SIZES}
              element={
                <SizeContextProvider>
                  <SizePage />
                </SizeContextProvider>
              }
            />
            <Route
              path={AppRoutes.PRODUCT_STATUS}
              element={
                <ProductStatusContextProvider>
                  <ProductStatusPage />
                </ProductStatusContextProvider>
              }
            />
          </Route>
        )}
      </Routes>
      <ToastContainer />
    </div>
  );
};

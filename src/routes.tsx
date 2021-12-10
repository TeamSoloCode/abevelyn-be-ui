import React, { useContext, useEffect, useRef } from "react";
import { Navigate, Route, Routes, useNavigate, useLocation } from "react-router";
import { AppRoutes } from "./constanst";
import { CollectionPage } from "./pages/collection.page";
import { ColorsPage } from "./pages/color/colors.page";
import { ProductStatusPage } from "./pages/product-status/product-status.page";
import { ProductsPage } from "./pages/product/products.page";
import { SizePage } from "./pages/size/sizes.page";
import { ColorContextProvider } from "./context/colors.context";
import { CollectionContextProvider } from "./context/collection.context";
import { ProductStatusContextProvider } from "./context/product-status.context";
import { SizeContextProvider } from "./context/size.context";
import { ProductContextProvider } from "./context/product.context";
import { CreateColor } from "./pages/color/create-color";
import { CreateSize } from "./pages/size/create-size";
import { CreateProductStatus } from "./pages/product-status/create-product-status";
import { CreateProduct } from "./pages/product/create-product";

export const routes = [
  {
    path: AppRoutes.COLLECTIONS,
    element: (
      <CollectionContextProvider>
        <CollectionPage />
      </CollectionContextProvider>
    ),
  },

  {
    path: AppRoutes.PRODUCTS,
    element: (
      <ProductContextProvider>
        <ProductsPage />
      </ProductContextProvider>
    ),
  },

  {
    path: AppRoutes.CREATE_PRODUCT,
    element: (
      <ProductContextProvider>
        <CreateProduct />
      </ProductContextProvider>
    ),
  },

  {
    path: AppRoutes.COLORS,
    element: (
      <ColorContextProvider>
        <ColorsPage />
      </ColorContextProvider>
    ),
  },

  {
    path: AppRoutes.CREATE_COLORS,
    element: (
      <ColorContextProvider>
        <CreateColor />
      </ColorContextProvider>
    ),
  },

  {
    path: AppRoutes.SIZES,
    element: (
      <SizeContextProvider>
        <SizePage />
      </SizeContextProvider>
    ),
  },

  {
    path: AppRoutes.CREATE_SIZE,
    element: (
      <SizeContextProvider>
        <CreateSize />
      </SizeContextProvider>
    ),
  },

  {
    path: AppRoutes.PRODUCT_STATUS,
    element: (
      <ProductStatusContextProvider>
        <ProductStatusPage />
      </ProductStatusContextProvider>
    ),
  },
  {
    path: AppRoutes.CREATE_PRODUCT_STATUS,
    element: (
      <ProductStatusContextProvider>
        <CreateProductStatus />
      </ProductStatusContextProvider>
    ),
  },
];

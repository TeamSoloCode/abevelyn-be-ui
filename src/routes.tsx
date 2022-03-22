import React, { useContext, useEffect, useRef } from "react";
import { AppRoutes } from "./constanst";
import { CollectionPage } from "./pages/collection/collection.page";
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
import { UpdateProduct } from "./pages/product/update-product";
import { MaterialContextProvider } from "./context/material.context";
import { MaterialPage } from "./pages/material/material.page";
import { CreateMaterial } from "./pages/material/create-material";
import { UpdateMaterial } from "./pages/material/update-material";
import { SaleContextProvider } from "./context/sale.context";
import { SalePage } from "./pages/sale/sale.page";
import { CreateSale } from "./pages/sale/create-sale";
import { CreateCollection } from "./pages/collection/create-collection";
import { UpdateCollection } from "./pages/collection/update-collection";
import { UsersContextProvider } from "./context/user.context";
import { Accounts } from "./pages/accounts/accounts.page";
import { UpdateAccount } from "./pages/accounts/update-account.page";
import { OrderPage } from "./pages/order/orders.page";
import { OrderContextProvider } from "./context/order.context";
import { UpdateSale } from "./pages/sale/update-sale";

export const routes = [
  {
    path: AppRoutes.COLLECTIONS + "/*",
    element: (
      <CollectionContextProvider>
        <CollectionPage />
      </CollectionContextProvider>
    ),
  },

  {
    path: AppRoutes.CREATE_COLLECTION,
    element: (
      <CollectionContextProvider>
        <CreateCollection />
      </CollectionContextProvider>
    ),
  },

  {
    path: AppRoutes.UPDATE_COLLECTION + "/:collectionId",
    element: (
      <CollectionContextProvider>
        <UpdateCollection />
      </CollectionContextProvider>
    ),
  },

  {
    path: AppRoutes.PRODUCTS + "/*",
    element: (
      <ProductContextProvider>
        <ProductsPage />
      </ProductContextProvider>
    ),
  },
  {
    path: AppRoutes.UPDATE_PRODUCT + "/:productId",
    element: (
      <ProductContextProvider>
        <UpdateProduct />
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
  {
    path: AppRoutes.MATERIAL,
    element: (
      <MaterialContextProvider>
        <MaterialPage />
      </MaterialContextProvider>
    ),
  },
  {
    path: AppRoutes.CREATE_MATERIAL,
    element: (
      <MaterialContextProvider>
        <CreateMaterial />
      </MaterialContextProvider>
    ),
  },
  {
    path: AppRoutes.SALE,
    element: (
      <SaleContextProvider>
        <SalePage />
      </SaleContextProvider>
    ),
  },
  {
    path: AppRoutes.CREATE_SALE,
    element: (
      <SaleContextProvider>
        <CreateSale />
      </SaleContextProvider>
    ),
  },
  // {
  //   path: AppRoutes.UPDATE_SALE,
  //   element: (
  //     <SaleContextProvider>
  //       <UpdateSale />
  //     </SaleContextProvider>
  //   ),
  // },

  {
    path: AppRoutes.USERS,
    element: (
      <UsersContextProvider>
        <Accounts />
      </UsersContextProvider>
    ),
  },

  {
    path: AppRoutes.UPDATE_USER + "/:userId",
    element: (
      <UsersContextProvider>
        <UpdateAccount />
      </UsersContextProvider>
    ),
  },

  {
    path: AppRoutes.ORDER,
    element: (
      <OrderContextProvider>
        <OrderPage />
      </OrderContextProvider>
    ),
  },
];

import React, { createContext, Dispatch, useCallback, useReducer } from "react";
import { productStatusApi } from "../client-api/api.client";
import { showError } from "../utils";
import { ProductStatus } from "../models/product-status.model";
import { ICreateProductStatusDto } from "../dto/product-status/create-product-status.req.dto";
import { IUpdateProductStatusDto } from "../dto/product-status/update-product-status.req.dto";

interface IProductStatusProviderProps {
  children?: any;
  initValue?: IProductStatusState;
}
interface IProductStatusState {
  productStatus: ProductStatus[] | undefined;
}

const INITIAL_STATE: IProductStatusState = {
  productStatus: undefined,
};

enum Actions {
  LOAD_PRODUCT_STATUS = "loadProductStatus",
}

interface IActionLoadProductStatus {
  type: Actions.LOAD_PRODUCT_STATUS;
  productStatus: ProductStatus[];
}

type ActionType = IActionLoadProductStatus;

interface IProductStatusContextValue {
  state: IProductStatusState;
  dispatch: Dispatch<ActionType>;
  loadProductStatus: () => void;
  createProductStatus: (createProductStatusDto: ICreateProductStatusDto) => Promise<ProductStatus | null>;
  updateProductStatus: (id: string, updateProductStatusDto: IUpdateProductStatusDto) => Promise<ProductStatus | null>;
  deleteProductStatus: (id: string) => Promise<ProductStatus | null>;
}

export const ProductStatusContext = createContext<IProductStatusContextValue | null>(null);

const reducer = (state: IProductStatusState, action: ActionType): IProductStatusState => {
  switch (action.type) {
    case Actions.LOAD_PRODUCT_STATUS: {
      return { ...state, productStatus: action.productStatus };
    }
    default:
      throw "Invalid action";
  }
};

export const ProductStatusContextProvider = (props: IProductStatusProviderProps) => {
  const [state, dispatch] = useReducer(reducer, {
    ...INITIAL_STATE,
    ...props.initValue,
  });

  const loadProductStatus = useCallback(async () => {
    const res = await productStatusApi.fetchProductStatus();
    const result = await res.json();
    if (res.status == 200) {
      dispatch({ type: Actions.LOAD_PRODUCT_STATUS, productStatus: result?.data });
    }

    showError(result?.message);
  }, [dispatch]);

  const createProductStatus = useCallback(
    async (createProductStatusDto: ICreateProductStatusDto): Promise<ProductStatus | null> => {
      const res = await productStatusApi.createProductStatus(createProductStatusDto);
      const result = await res.json();
      if (res.status == 201) {
        loadProductStatus();
        return result?.data;
      }
      showError(result?.message);
      return null;
    },
    [dispatch]
  );

  const updateProductStatus = useCallback(
    async (id: string, updateProductStatusDto: IUpdateProductStatusDto): Promise<ProductStatus | null> => {
      const res = await productStatusApi.updateProductStatus(id, updateProductStatusDto);
      const result = await res.json();
      if (res.status == 200) {
        loadProductStatus();
        return result?.data;
      }
      showError(result?.message);
      return null;
    },
    [dispatch]
  );

  const deleteProductStatus = useCallback(
    async (id: string): Promise<ProductStatus | null> => {
      const res = await productStatusApi.deleteProductStatus(id);
      const result = await res.json();
      if (res.status == 200) {
        loadProductStatus();
        return result?.data;
      }
      showError(result?.message);
      return null;
    },
    [dispatch]
  );

  return React.createElement(
    ProductStatusContext.Provider,
    {
      value: {
        state,
        dispatch,
        loadProductStatus,
        createProductStatus,
        updateProductStatus,
        deleteProductStatus,
      },
    },
    props.children
  );
};

export default ProductStatusContext;

import React, { createContext, Dispatch, useCallback, useReducer } from "react";
import { showError, showSuccess } from "../utils";
import { productApi } from "../client-api/api.client";
import { Product } from "../models/product.model";
import { ICreateProductDto } from "../dto/product/create-product-req.dto";
import { IUpdateProductDto } from "../dto/product/update-product-req-dto";

interface IProductProviderProps {
  children?: any;
  initValue?: IProductState;
}

interface IProductState {
  products: Product[] | undefined;
}

const INITIAL_STATE: IProductState = {
  products: undefined,
};

enum Actions {
  LOAD_PRODUCT = "loadproduct",
}

interface IActionLoadProduct {
  type: Actions.LOAD_PRODUCT;
  products: Product[];
}

type ActionType = IActionLoadProduct;

interface IProductContextValue {
  state: IProductState;
  dispatch?: Dispatch<ActionType>;
  loadProduct: () => void;
  createProduct: (createProductDto: ICreateProductDto) => Promise<Product | null>;
  updateProduct: (id: string, updateProductDto: IUpdateProductDto) => Promise<Product | null>;
  deleteProduct: (id: string) => Promise<Product | null>;
}

export const ProductContext = createContext<IProductContextValue | null>(null);

const reducer = (state: IProductState, action: ActionType): IProductState => {
  switch (action.type) {
    case Actions.LOAD_PRODUCT: {
      return { ...state, products: action.products };
    }
    default:
      throw "Invalid action";
  }
};

export const ProductContextProvider = (props: IProductProviderProps) => {
  const [state, dispatch] = useReducer(reducer, {
    ...INITIAL_STATE,
    ...props.initValue,
  });

  const loadProduct = useCallback(async () => {
    const res = await productApi.fetch();
    const result = await res.json();
    if (res.status == 200) {
      dispatch({ type: Actions.LOAD_PRODUCT, products: result.data });
    }

    showError(result?.message);
  }, [dispatch]);

  const createProduct = useCallback(
    async (createProductDto: ICreateProductDto): Promise<Product | null> => {
      const res = await productApi.create(createProductDto);
      const result = await res.json();
      if (res.status == 201) {
        loadProduct();
        showSuccess(result?.message);
        return result.data;
      }
      showError(result?.message);
      return null;
    },
    [dispatch, loadProduct]
  );

  const updateProduct = useCallback(
    async (id: string, updateProductDto: IUpdateProductDto): Promise<Product | null> => {
      const res = await productApi.update(id, updateProductDto);
      const result = await res.json();
      if (res.status == 200) {
        // loadProduct();
        showSuccess(result?.message);
        return result.data;
      }
      showError(result?.message);
      return null;
    },
    [dispatch, loadProduct]
  );

  const deleteProduct = useCallback(
    async (id: string): Promise<Product | null> => {
      const res = await productApi.delete(id);
      const result = await res.json();
      if (res.status == 200) {
        loadProduct();
        return result.data;
      }
      showError(result?.message);
      return null;
    },
    [dispatch, loadProduct]
  );

  return React.createElement(
    ProductContext.Provider,
    {
      value: {
        state,
        dispatch,
        loadProduct: loadProduct,
        createProduct: createProduct,
        updateProduct: updateProduct,
        deleteProduct: deleteProduct,
      },
    },
    props.children
  );
};

export default ProductContext;

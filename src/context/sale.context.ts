import React, { createContext, Dispatch, useCallback, useReducer } from "react";
import { saleApi } from "../client-api/api.client";
import { ICreateSaleDto } from "../dto/sales/create-sale.dto";
import { IUpdateSaleDto } from "../dto/sales/update-sale.dto";
import { Sale } from "../models/sale.model";
import { showError, showSuccess } from "../utils";

interface ISaleProviderProps {
  children?: any;
  initValue?: ISaleState;
}
interface ISaleState {
  sales: Sale[] | undefined;
}

const INITIAL_STATE: ISaleState = {
  sales: undefined,
};

enum Actions {
  LOAD_PRODUCT_STATUS = "loadSales",
}

interface IActionLoadSales {
  type: Actions.LOAD_PRODUCT_STATUS;
  sales: Sale[];
}

type ActionType = IActionLoadSales;

interface ISaleContextValue {
  state: ISaleState;
  dispatch: Dispatch<ActionType>;
  loadSales: () => void;
  createSale: (createSaleDto: ICreateSaleDto) => Promise<Sale | null>;
  updateSale: (id: string, updateSaleDto: IUpdateSaleDto) => Promise<Sale | null>;
  deleteSale: (id: string) => Promise<Sale | null>;
}

export const SaleContext = createContext<ISaleContextValue | null>(null);

const reducer = (state: ISaleState, action: ActionType): ISaleState => {
  switch (action.type) {
    case Actions.LOAD_PRODUCT_STATUS: {
      return { ...state, sales: action.sales };
    }
    default:
      throw "Invalid action";
  }
};

export const SaleContextProvider = (props: ISaleProviderProps) => {
  const [state, dispatch] = useReducer(reducer, {
    ...INITIAL_STATE,
    ...props.initValue,
  });

  const loadSales = useCallback(async () => {
    const res = await saleApi.fetch();
    const result = await res.json();
    if (res.status == 200) {
      dispatch({ type: Actions.LOAD_PRODUCT_STATUS, sales: result?.data });
    }

    showError(result?.message);
  }, [dispatch]);

  const createSale = useCallback(
    async (createSaleDto: ICreateSaleDto): Promise<Sale | null> => {
      const res = await saleApi.create(createSaleDto);
      const result = await res.json();
      if (res.status == 201) {
        loadSales();
        showSuccess(result?.message);
        return result?.data;
      }
      showError(result?.message);
      return null;
    },
    [dispatch]
  );

  const updateSale = useCallback(
    async (id: string, updateSaleDto: IUpdateSaleDto): Promise<Sale | null> => {
      const res = await saleApi.update(id, updateSaleDto);
      const result = await res.json();
      if (res.status == 200) {
        loadSales();
        showSuccess(result?.message);
        return result?.data;
      }
      showError(result?.message);
      return null;
    },
    [dispatch]
  );

  const deleteSale = useCallback(
    async (id: string): Promise<Sale | null> => {
      const res = await saleApi.delete(id);
      const result = await res.json();
      if (res.status == 200) {
        loadSales();
        return result?.data;
      }
      showError(result?.message);
      return null;
    },
    [dispatch]
  );

  return React.createElement(
    SaleContext.Provider,
    {
      value: {
        state,
        dispatch,
        loadSales,
        createSale,
        updateSale,
        deleteSale,
      },
    },
    props.children
  );
};

export default SaleContext;

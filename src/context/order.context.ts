import React, { createContext, Dispatch, useCallback, useReducer } from "react";
import { orderApi } from "../client-api/api.client";
import { IUpdateOrderDto } from "../dto/orders/update-order.dto";
import { Order } from "../models/order.model";
import { showError } from "../utils";

interface IOrderProviderProps {
  children?: any;
  initValue?: IOrderState;
}
interface IOrderState {
  orders: Order[] | undefined;
}

const INITIAL_STATE: IOrderState = {
  orders: undefined,
};

enum Actions {
  LOAD_ORDER = "loadOrders",
}

interface IActionLoadOrders {
  type: Actions.LOAD_ORDER;
  orders: Order[];
}

type ActionType = IActionLoadOrders;

interface IOrderContextValue {
  state: IOrderState;
  dispatch: Dispatch<ActionType>;
  load: () => void;
  update: (id: string, updateOrderDto: IUpdateOrderDto) => Promise<Order | null>;
}

export const OrderContext = createContext<IOrderContextValue | null>(null);

const reducer = (state: IOrderState, action: ActionType): IOrderState => {
  switch (action.type) {
    case Actions.LOAD_ORDER: {
      return { ...state, orders: action.orders };
    }
    default:
      throw "Invalid action";
  }
};

export const OrderContextProvider = (props: IOrderProviderProps) => {
  const [state, dispatch] = useReducer(reducer, {
    ...INITIAL_STATE,
    ...props.initValue,
  });

  const load = useCallback(async () => {
    const res = await orderApi.fetch();
    const result = await res.json();
    if (res.status == 200) {
      dispatch({ type: Actions.LOAD_ORDER, orders: result?.data });
    }

    showError(result?.message);
  }, [dispatch]);

  //   const createMaterial = useCallback(
  //     async (createMaterialDto: ICreateMaterialDto): Promise<Material | null> => {
  //       const res = await orderApi.create(createMaterialDto);
  //       const result = await res.json();
  //       if (res.status == 201) {
  //         load();
  //         return result?.data;
  //       }
  //       showError(result?.message);
  //       return null;
  //     },
  //     [dispatch]
  //   );

  const update = useCallback(
    async (id: string, updateOrderDto: IUpdateOrderDto): Promise<Order | null> => {
      const res = await orderApi.update(id, updateOrderDto);
      const result = await res.json();
      if (res.status == 200) {
        load();
        return result?.data;
      }
      showError(result?.message);
      return null;
    },
    [dispatch]
  );

  return React.createElement(
    OrderContext.Provider,
    {
      value: {
        state,
        dispatch,
        load,
        // createMaterial,
        update,
      },
    },
    props.children
  );
};

export default OrderContext;

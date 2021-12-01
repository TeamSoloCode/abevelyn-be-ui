import React, { createContext, Dispatch, useCallback, useReducer } from "react";
import { sizeApi } from "../client-api/api.client";
import { ICreateSizeReqDto } from "../dto/size/create-size.req.dto";
import { IUpdateSizeReqDto } from "../dto/size/update-size.req.dto";
import { Size } from "../models/size.model";
import { showError } from "../utils";

interface ISizeProviderProps {
  children?: any;
  initValue?: ISizeState;
}
interface ISizeState {
  sizes: Size[] | undefined;
}

const INITIAL_STATE: ISizeState = {
  sizes: undefined,
};

enum Actions {
  LOAD_PRODUCT_STATUS = "loadSizes",
}

interface IActionLoadSizes {
  type: Actions.LOAD_PRODUCT_STATUS;
  sizes: Size[];
}

type ActionType = IActionLoadSizes;

interface ISizeContextValue {
  state: ISizeState;
  dispatch: Dispatch<ActionType>;
  loadSizes: () => void;
  createSize: (createSizeDto: ICreateSizeReqDto) => Promise<Size | null>;
  updateSize: (id: string, updateSizeDto: IUpdateSizeReqDto) => Promise<Size | null>;
  deleteSize: (id: string) => Promise<Size | null>;
}

export const SizeContext = createContext<ISizeContextValue | null>(null);

const reducer = (state: ISizeState, action: ActionType): ISizeState => {
  switch (action.type) {
    case Actions.LOAD_PRODUCT_STATUS: {
      return { ...state, sizes: action.sizes };
    }
    default:
      throw "Invalid action";
  }
};

export const SizeContextProvider = (props: ISizeProviderProps) => {
  const [state, dispatch] = useReducer(reducer, {
    ...INITIAL_STATE,
    ...props.initValue,
  });

  const loadSizes = useCallback(async () => {
    const res = await sizeApi.fetch();
    const result = await res.json();
    if (res.status == 200) {
      dispatch({ type: Actions.LOAD_PRODUCT_STATUS, sizes: result?.data });
    }

    showError(result?.message);
  }, [dispatch]);

  const createSize = useCallback(
    async (createSizeDto: ICreateSizeReqDto): Promise<Size | null> => {
      const res = await sizeApi.create(createSizeDto);
      const result = await res.json();
      if (res.status == 201) {
        loadSizes();
        return result?.data;
      }
      showError(result?.message);
      return null;
    },
    [dispatch]
  );

  const updateSize = useCallback(
    async (id: string, updateSizeDto: IUpdateSizeReqDto): Promise<Size | null> => {
      const res = await sizeApi.update(id, updateSizeDto);
      const result = await res.json();
      if (res.status == 200) {
        loadSizes();
        return result?.data;
      }
      showError(result?.message);
      return null;
    },
    [dispatch]
  );

  const deleteSize = useCallback(
    async (id: string): Promise<Size | null> => {
      const res = await sizeApi.delete(id);
      const result = await res.json();
      if (res.status == 200) {
        loadSizes();
        return result?.data;
      }
      showError(result?.message);
      return null;
    },
    [dispatch]
  );

  return React.createElement(
    SizeContext.Provider,
    {
      value: {
        state,
        dispatch,
        loadSizes,
        createSize,
        updateSize,
        deleteSize,
      },
    },
    props.children
  );
};

export default SizeContext;

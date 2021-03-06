import React, { createContext, Dispatch, useCallback, useReducer } from "react";
import { Color } from "../models/color.model";
import { colorApi } from "../client-api/api.client";
import { showError, showSuccess } from "../utils";
import { ICreateColorReqDto } from "../dto/colors/create-color.req.dto";
import { IUpdateColorReqDto } from "../dto/colors/update-color.req.dto";

interface IColorProviderProps {
  children?: any;
  initValue?: IColorState;
}
interface IColorState {
  colors: Color[] | undefined;
}

const INITIAL_STATE: IColorState = {
  colors: undefined,
};

enum Actions {
  LOAD_COLORS = "loadColor",
}

interface IActionLoadColor {
  type: Actions.LOAD_COLORS;
  colors: Color[];
}

type ActionType = IActionLoadColor;

interface IColorContextValue {
  state: IColorState;
  dispatch?: Dispatch<ActionType>;
  loadColor?: () => void;
  createColor?: (createColorDto: ICreateColorReqDto) => Promise<Color | null>;
  updateColor?: (id: string, updateColorDto: IUpdateColorReqDto) => Promise<Color | null>;
  deleteColor?: (id: string) => Promise<Color | null>;
}

export const ColorContext = createContext<IColorContextValue>({ state: INITIAL_STATE });

const reducer = (state: IColorState, action: ActionType): IColorState => {
  switch (action.type) {
    case Actions.LOAD_COLORS: {
      return { ...state, colors: action.colors };
    }
    default:
      throw "Invalid action";
  }
};

export const ColorContextProvider = (props: IColorProviderProps) => {
  const [state, dispatch] = useReducer(reducer, {
    ...INITIAL_STATE,
    ...props.initValue,
  });

  const loadColor = useCallback(async () => {
    const res = await colorApi.fetch();
    const result = await res.json();
    if (res.status == 200) {
      dispatch({ type: Actions.LOAD_COLORS, colors: result?.data });
      return;
    }

    showError(result?.message);
  }, [dispatch]);

  const createColor = useCallback(
    async (createColorDto: ICreateColorReqDto): Promise<Color | null> => {
      const res = await colorApi.create(createColorDto);
      const result = await res.json();
      if (res.status == 201) {
        // loadColor();
        return result?.data;
      }
      showError(result?.message);
      return null;
    },
    [dispatch]
  );

  const updateColor = useCallback(
    async (id: string, updateColorDto: IUpdateColorReqDto): Promise<Color | null> => {
      const res = await colorApi.update(id, updateColorDto);
      const result = await res.json();
      if (res.status == 200) {
        loadColor();
        showSuccess(result?.message);
        return result?.data;
      }
      showError(result?.message);
      return null;
    },
    [dispatch]
  );

  const deleteColor = useCallback(
    async (id: string): Promise<Color | null> => {
      const res = await colorApi.delete(id);
      const result = await res.json();
      if (res.status == 200) {
        loadColor();
        return result?.data;
      }
      showError(result?.message);
      return null;
    },
    [dispatch]
  );

  return React.createElement(
    ColorContext.Provider,
    {
      value: {
        state,
        dispatch,
        loadColor,
        createColor,
        updateColor,
        deleteColor,
      },
    },
    props.children
  );
};

export default ColorContext;

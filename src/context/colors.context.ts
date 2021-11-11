import { createContext } from "react";
import { Color } from "../models/color.model";

interface IColorState {
  colors: Color[];
}

interface IContextProviderProps {
  children?: any;
  initValue?: IColorState;
}

export const ColorContext = createContext({});

const reducer = (state: IColorState, action) => {};

export const ColorContextProvider = (props: IContextProviderProps) => {};

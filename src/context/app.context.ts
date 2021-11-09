import React, { createContext, Dispatch, useCallback, useEffect } from "react";
import clientApi from "../client-api";

interface IAppContextState {
  authenticated: boolean;
  username?: string;
}

interface IAppContextProps {
  children?: any;
  initValue?: IAppContextState;
}

enum Actions {
  AUTHENTICATED = "authenticated",
  CHANGE_LANGUAGE = "changeLanguage",
}

interface IActionChangeLanguage {
  type: Actions.CHANGE_LANGUAGE;
  language: string;
}

interface IActionAuthenticated {
  type: Actions.AUTHENTICATED;
  authenticated: boolean;
  username: string;
}

type ActionType = IActionChangeLanguage | IActionAuthenticated;

interface IAppContextValue {
  state: IAppContextState;
  dispatch?: Dispatch<ActionType>;
  login?: (username: string, password: string) => void;
}

const INITIAL_STATE: IAppContextState = {
  authenticated: false,
};

const reducer = (state: IAppContextState, action: ActionType): IAppContextState => {
  switch (action.type) {
    case Actions.AUTHENTICATED: {
      return { ...state, authenticated: action.authenticated, username: action.username };
    }
    default:
      throw "Invalid action";
  }
};

const AppContext = createContext<IAppContextValue>({ state: INITIAL_STATE });

export const AppContextProvider = (props: IAppContextProps) => {
  const [state, dispatch] = React.useReducer(reducer, {
    ...INITIAL_STATE,
    ...props.initValue,
  });

  const login = useCallback(
    async (username: string, password: string) => {
      const result = await clientApi.signin(username, password);
      if (result) {
        dispatch({ type: Actions.AUTHENTICATED, authenticated: true, username: result.username });
      }
    },
    [state.authenticated, dispatch]
  );

  return React.createElement(
    AppContext.Provider,
    {
      value: {
        state,
        dispatch,
        login,
      },
    },
    props.children
  );
};

export default AppContext;

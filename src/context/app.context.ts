import React, { createContext, Dispatch, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { clientApi, ClientApi } from "../client-api/api.client";
import Cookie from "cookie-universal";
import { showError } from "../utils";

interface IAppContextState {
  authenticated: boolean | undefined;
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
  username?: string;
}

type ActionType = IActionChangeLanguage | IActionAuthenticated;

interface IAppContextValue {
  state: IAppContextState;
  dispatch?: Dispatch<ActionType>;
  login?: (username: string, password: string) => void;
}

const INITIAL_STATE: IAppContextState = {
  authenticated: undefined,
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
  const navigate = useNavigate();
  const [state, dispatch] = React.useReducer(reducer, {
    ...INITIAL_STATE,
    ...props.initValue,
  });

  useEffect(() => {
    if (state.authenticated == undefined) {
      const token = Cookie().get(ClientApi.COOKIE_KEYS.TOKEN);
      if (token) {
        const username = Cookie().get(ClientApi.COOKIE_KEYS.USERNAME);
        clientApi.verify_token().then((authenticated) => {
          dispatch({ type: Actions.AUTHENTICATED, authenticated, username });
          if (authenticated == false) navigate("/");
        });
      } else {
        dispatch({ type: Actions.AUTHENTICATED, authenticated: false });
      }
    }
  }, [state.authenticated]);

  const login = useCallback(
    async (username: string, password: string) => {
      const response = await clientApi.signin(username, password);

      if (response instanceof Response) {
        const error = await response.json();
        showError(error.message);
      } else {
        dispatch({ type: Actions.AUTHENTICATED, authenticated: true, username: response.username });
        navigate("/");
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

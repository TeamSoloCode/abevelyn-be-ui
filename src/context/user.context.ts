import React, { Dispatch } from "react";
import { userApi } from "../client-api/api.client";
import { UserRoles } from "../constanst";
import { User } from "../models/user.model";
import { showError, showSuccess } from "../utils";

interface IUsersProviderProps {
  children?: any;
  initValue?: IUserState;
}
interface IUserState {
  users: User[] | undefined;
}

const INITIAL_STATE: IUserState = {
  users: undefined,
};

enum Actions {
  LOAD_USERS = "loadUsers",
}

interface IActionLoadUsers {
  type: Actions.LOAD_USERS;
  users: User[];
}

type ActionType = IActionLoadUsers;

interface IUserContextValue {
  state: IUserState;
  dispatch: Dispatch<ActionType>;
  loadUsers: () => void;
  updateUserRole: (id: string, role: UserRoles) => Promise<User | null>;
}

export const UsersContext = React.createContext<IUserContextValue | null>(null);

const reducer = (state: IUserState, action: ActionType): IUserState => {
  switch (action.type) {
    case Actions.LOAD_USERS: {
      return { ...state, users: action.users };
    }
    default:
      throw "Invalid action";
  }
};

export const UsersContextProvider = (props: IUsersProviderProps) => {
  const [state, dispatch] = React.useReducer(reducer, {
    ...INITIAL_STATE,
    ...props.initValue,
  });

  const loadUsers = React.useCallback(async () => {
    const res = await userApi.fetch();
    const result = await res.json();
    if (res.status == 200) {
      dispatch({ type: Actions.LOAD_USERS, users: result?.data });
    }

    showError(result?.message);
  }, [dispatch]);

  const updateUserRole = React.useCallback(
    async (id: string, role: UserRoles): Promise<User | null> => {
      const res = await userApi.updateUserRole(id, role);
      const result = await res.json();
      if (res.status == 200) {
        loadUsers();
        showSuccess(result?.message);
        return result?.data;
      }
      showError(result?.message);
      return null;
    },
    [dispatch]
  );

  return React.createElement(
    UsersContext.Provider,
    {
      value: {
        state,
        dispatch,
        loadUsers,
        updateUserRole,
      },
    },
    props.children
  );
};

export default UsersContext;

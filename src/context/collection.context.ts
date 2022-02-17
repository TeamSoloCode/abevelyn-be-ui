import React, { createContext, Dispatch, useCallback, useReducer } from "react";
import { showError, showSuccess } from "../utils";
import { Collection } from "../models/collection.model";
import { ICreateCollectionDto } from "../dto/collections/create-collection.req.dto";
import { IUpdateCollectionDto } from "../dto/collections/update-collection.req.dto";
import { collectionApi } from "../client-api/api.client";

interface ICollectionProviderProps {
  children?: any;
  initValue?: ICollectionState;
}

interface ICollectionState {
  collections: Collection[] | undefined;
}

const INITIAL_STATE: ICollectionState = {
  collections: undefined,
};

enum Actions {
  LOAD_COLLECTIONS = "loadCollection",
}

interface IActionLoadCollection {
  type: Actions.LOAD_COLLECTIONS;
  collections: Collection[];
}

type ActionType = IActionLoadCollection;

interface ICollectionContextValue {
  state: ICollectionState;
  dispatch?: Dispatch<ActionType>;
  loadCollection?: () => void;
  createCollection?: (createCollectionDto: ICreateCollectionDto) => Promise<Collection | null>;
  updateCollection?: (id: string, updateCollectionDto: IUpdateCollectionDto) => Promise<Collection | null>;
  deleteCollection?: (id: string) => Promise<Collection | null>;
}

export const CollectionContext = createContext<ICollectionContextValue>({ state: INITIAL_STATE });

const reducer = (state: ICollectionState, action: ActionType): ICollectionState => {
  switch (action.type) {
    case Actions.LOAD_COLLECTIONS: {
      return { ...state, collections: action.collections };
    }
    default:
      throw "Invalid action";
  }
};

export const CollectionContextProvider = (props: ICollectionProviderProps) => {
  const [state, dispatch] = useReducer(reducer, {
    ...INITIAL_STATE,
    ...props.initValue,
  });

  const loadCollection = useCallback(async () => {
    const res = await collectionApi.fetch();
    const result = await res.json();
    if (res.status == 200) {
      dispatch({ type: Actions.LOAD_COLLECTIONS, collections: result.data });
    }

    showError(result?.message);
  }, [dispatch]);

  const createCollection = useCallback(
    async (createCollectionDto: ICreateCollectionDto): Promise<Collection | null> => {
      const res = await collectionApi.createCollection(createCollectionDto);
      const result = await res.json();
      if (res.status == 201) {
        loadCollection();
        return result.data;
      }
      showError(result?.message);
      return null;
    },
    [dispatch, loadCollection]
  );

  const updateCollection = useCallback(
    async (id: string, updateCollectionDto: IUpdateCollectionDto): Promise<Collection | null> => {
      const res = await collectionApi.updateCollection(id, updateCollectionDto);
      const result = await res.json();
      if (res.status == 200) {
        loadCollection();
        showSuccess(result?.message);
        return result.data;
      }
      showError(result?.message);
      return null;
    },
    [dispatch, loadCollection]
  );

  const deleteCollection = useCallback(
    async (id: string): Promise<Collection | null> => {
      const res = await collectionApi.delete(id);
      const result = await res.json();
      if (res.status == 200) {
        loadCollection();
        return result.data;
      }
      showError(result?.message);
      return null;
    },
    [dispatch, loadCollection]
  );

  return React.createElement(
    CollectionContext.Provider,
    {
      value: {
        state,
        dispatch,
        loadCollection,
        createCollection,
        updateCollection,
        deleteCollection,
      },
    },
    props.children
  );
};

export default CollectionContext;

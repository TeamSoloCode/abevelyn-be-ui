import React, { createContext, Dispatch, useCallback, useReducer } from "react";
import { materialApi } from "../client-api/api.client";
import { ICreateMaterialDto } from "../dto/materials/create-material.req.dto";
import { IUpdateMaterialDto } from "../dto/materials/update-material.req.dto";
import { Material } from "../models/material.models";
import { showError } from "../utils";

interface IMaterialProviderProps {
  children?: any;
  initValue?: IMaterialState;
}
interface IMaterialState {
  materials: Material[] | undefined;
}

const INITIAL_STATE: IMaterialState = {
  materials: undefined,
};

enum Actions {
  LOAD_MATERIAL = "loadMaterials",
}

interface IActionLoadMaterials {
  type: Actions.LOAD_MATERIAL;
  materials: Material[];
}

type ActionType = IActionLoadMaterials;

interface IMaterialContextValue {
  state: IMaterialState;
  dispatch: Dispatch<ActionType>;
  loadMaterials: () => void;
  createMaterial: (createMaterialDto: ICreateMaterialDto) => Promise<Material | null>;
  updateMaterial: (id: string, updateMaterialDto: IUpdateMaterialDto) => Promise<Material | null>;
  deleteMaterial: (id: string) => Promise<Material | null>;
}

export const MaterialContext = createContext<IMaterialContextValue | null>(null);

const reducer = (state: IMaterialState, action: ActionType): IMaterialState => {
  switch (action.type) {
    case Actions.LOAD_MATERIAL: {
      return { ...state, materials: action.materials };
    }
    default:
      throw "Invalid action";
  }
};

export const MaterialContextProvider = (props: IMaterialProviderProps) => {
  const [state, dispatch] = useReducer(reducer, {
    ...INITIAL_STATE,
    ...props.initValue,
  });

  const loadMaterials = useCallback(async () => {
    const res = await materialApi.fetch();
    const result = await res.json();
    if (res.status == 200) {
      dispatch({ type: Actions.LOAD_MATERIAL, materials: result?.data });
    }

    showError(result?.message);
  }, [dispatch]);

  const createMaterial = useCallback(
    async (createMaterialDto: ICreateMaterialDto): Promise<Material | null> => {
      const res = await materialApi.create(createMaterialDto);
      const result = await res.json();
      if (res.status == 201) {
        loadMaterials();
        return result?.data;
      }
      showError(result?.message);
      return null;
    },
    [dispatch]
  );

  const updateMaterial = useCallback(
    async (id: string, updateMaterialDto: IUpdateMaterialDto): Promise<Material | null> => {
      const res = await materialApi.update(id, updateMaterialDto);
      const result = await res.json();
      if (res.status == 200) {
        loadMaterials();
        return result?.data;
      }
      showError(result?.message);
      return null;
    },
    [dispatch]
  );

  const deleteMaterial = useCallback(
    async (id: string): Promise<Material | null> => {
      const res = await materialApi.delete(id);
      const result = await res.json();
      if (res.status == 200) {
        loadMaterials();
        return result?.data;
      }
      showError(result?.message);
      return null;
    },
    [dispatch]
  );

  return React.createElement(
    MaterialContext.Provider,
    {
      value: {
        state,
        dispatch,
        loadMaterials,
        createMaterial,
        updateMaterial,
        deleteMaterial,
      },
    },
    props.children
  );
};

export default MaterialContext;

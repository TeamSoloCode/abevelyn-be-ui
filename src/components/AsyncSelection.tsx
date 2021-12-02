import React, { memo, useCallback, useState } from "react";
import { GroupBase, OptionsOrGroups, SingleValue } from "react-select";
import AsyncSelect from "react-select/async";

const customStyles = {
  menu: (provided, state) => ({
    ...provided,
    padding: 3,
  }),
  option: (styles, props) => {
    return {
      ...styles,
    };
  },
  control: (styles) => ({
    ...styles,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "30rem",
    minHeight: "3rem",
    height: "4rem",
  }),

  singleValue: (provided, state) => {
    const opacity = state.isDisabled ? 0.5 : 1;
    const transition = "opacity 300ms";

    return { ...provided, opacity, transition };
  },
};

export interface Option {
  value: string;
  label: string;
  isDisabled?: boolean;
}

interface IAsyncSelection {
  options?: Option[];
  defaultValue?: Option;
  loadOptions: (input: string, callback: (options: Option[]) => void) => void;
  onChange?: (newValue: SingleValue<Option>) => void;
}

export const AsyncSelection = memo((props: IAsyncSelection) => {
  return (
    <AsyncSelect
      styles={customStyles}
      defaultOptions={props.options}
      defaultValue={props.defaultValue}
      loadOptions={props.loadOptions}
      onChange={props.onChange}
    />
  );
});

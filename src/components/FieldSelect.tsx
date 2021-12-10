import React, { Fragment, memo, useCallback, useState } from "react";
import { components, MenuListProps, MenuProps, SingleValue } from "react-select";
import AsyncSelect from "react-select/async";
import InputGroup from "react-bootstrap/InputGroup";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

const customStyles = {
  menu: (provided, state) => ({
    ...provided,
    padding: 3,
    marginTop: 3,
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

interface IFieldSelect {
  label: string;
  placeholder?: string;
  options?: Option[];
  defaultValue?: Option;
  loadOptions: (input: string, callback: (options: Option[]) => void) => void;
  onChange?: (newValue: SingleValue<Option>) => void;
  onMenuOpen?: () => void;
}

export const FieldSelect = memo((props: IFieldSelect) => {
  const onAddNew = useCallback((e) => {
    console.log("onAddNew");
  }, []);

  const MenuList = useCallback(
    (props: MenuListProps<any, false, any>) => {
      return (
        <components.MenuList {...props}>
          <Button className="mt-1 w-100" onClick={onAddNew}>
            Add new
          </Button>
          {props.children}
        </components.MenuList>
      );
    },
    [onAddNew]
  );

  return (
    <InputGroup className="mb-2 w-100">
      <Col xs="2">
        <InputGroup.Text className="h-100">{props.label}</InputGroup.Text>
      </Col>
      <Col xs="10">
        <AsyncSelect
          styles={customStyles}
          placeholder={props.placeholder}
          defaultOptions={props.options}
          defaultValue={props.defaultValue}
          loadOptions={props.loadOptions}
          onChange={props.onChange}
          onMenuOpen={props.onMenuOpen}
          components={{ MenuList }}
        />
      </Col>
    </InputGroup>
  );
});

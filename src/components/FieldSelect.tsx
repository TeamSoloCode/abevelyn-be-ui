import React, { Fragment, memo, useCallback, useState } from "react";
import { components, MenuListProps, MenuProps, SingleValue } from "react-select";
import AsyncSelect from "react-select/async";
import InputGroup from "react-bootstrap/InputGroup";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router";
import { AppRoutes } from "../constanst";

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
  addNewURL?: string;
  hideAddNewButton?: boolean;
  loadOptions?: (input: string, callback: (options: Option[]) => void) => void;
  onChange?: (newValue: SingleValue<Option>) => void;
  onMenuOpen?: () => void;
}

export const FieldSelect = memo((props: IFieldSelect) => {
  const MenuList = useCallback(
    (menuProps: MenuListProps<any, false, any>) => {
      return (
        <components.MenuList {...menuProps}>
          {!props.hideAddNewButton && (
            <a className="w-100 btn" href={`/${props.addNewURL}`} target="_blank">
              <Button className="mt-1 w-100">Add new</Button>
            </a>
          )}
          {menuProps.children}
        </components.MenuList>
      );
    },
    [props.hideAddNewButton]
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

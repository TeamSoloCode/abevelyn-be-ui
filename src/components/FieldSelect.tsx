import React, { Fragment, memo, useCallback, useEffect, useState, useRef } from "react";
import { components, MenuListProps, MenuProps, MultiValue, SingleValue } from "react-select";
import AsyncSelect from "react-select/async";
import InputGroup from "react-bootstrap/InputGroup";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import { AppRoutes } from "../constanst";
import { findOptionByValue, usePrevious } from "../utils";
import Select from "react-select/dist/declarations/src/Select";
import isEqual from "lodash.isequal";

const customStyles = {
  menu: (provided, state) => ({
    ...provided,
    padding: 3,
    marginTop: 3,
  }),
  menuPortal: (base) => ({ ...base, zIndex: 3 }),
  valueContainer: (base) => ({ ...base, outerHeight: 1300 }),
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
    width: "50rem",
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
  value?: string;
  label: string;
  isDisabled?: boolean;
}

interface IFieldSelect {
  label: string;
  placeholder?: string;
  options?: Option[];
  value?: Option;
  loadOnMount?: boolean;
  defaultValue?: string | string[];
  addNewURL?: string;
  hideAddNewButton?: boolean;
  loadDataFunction?: Function;
  isMulti?: any;
  loadOptions?: (input: string, callback: (options: Option[]) => void) => void;
  onChange?: (newValue: SingleValue<Option>) => void;
  onMenuOpen?: () => void;
}

export const FieldSelect = memo((props: IFieldSelect) => {
  const [options, setOptions] = useState<Option[]>();
  const ref = useRef<Select<Option, false, any> | null>();
  const prevOptions = usePrevious(options);

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

  useEffect(() => {
    if (props.loadOnMount) {
      (async () => {
        if (props.loadDataFunction && props.loadDataFunction instanceof Function) {
          const colorOptions = await props?.loadDataFunction?.();
          // const res = findOptionByValue(options || [], props.defaultValue);
          setOptions(colorOptions);
          // res && ref.current?.setValue(res, "select-option");
        }
      })();
    }
  }, [props.loadOnMount]);

  useEffect(() => {
    if (props.loadOnMount) {
      (async () => {
        if (options && !isEqual(options, prevOptions)) {
          const defaultValue = props.defaultValue;
          if (defaultValue instanceof Array) {
            const ops = defaultValue.map((value) => {
              return findOptionByValue(options || [], value);
            });

            ops && ref.current?.setValue(ops, "select-option");
          }

          if (typeof defaultValue === "string") {
            const res = findOptionByValue(options || [], defaultValue);
            res && ref.current?.setValue(res, "select-option");
          }
        }
      })();
    }
  }, [props.loadOnMount, props.defaultValue, ref.current, options]);

  const onOpenMenuOption = useCallback(async () => {
    if (props.onMenuOpen) props.onMenuOpen();

    if (props.loadDataFunction && props.loadDataFunction instanceof Function) {
      const options = await props?.loadDataFunction?.();
      setOptions(options);
    }
  }, [props.onMenuOpen, props.loadDataFunction]);

  return (
    <InputGroup className="mb-2 w-100">
      <Col xs="2">
        <InputGroup.Text className="h-100">{props.label}</InputGroup.Text>
      </Col>
      <Col xs="10">
        <AsyncSelect
          ref={(selectRef) => (ref.current = selectRef)}
          styles={customStyles}
          isLoading={!(!!options || !!props.loadOnMount)}
          isMulti={props.isMulti}
          menuPortalTarget={document.body}
          value={props.value}
          placeholder={props.placeholder}
          defaultOptions={props.options || options}
          loadOptions={props.loadOptions}
          onChange={props.onChange}
          onMenuOpen={onOpenMenuOption}
          components={{ MenuList }}
        />
      </Col>
    </InputGroup>
  );
});

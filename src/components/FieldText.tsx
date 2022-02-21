import React, { memo } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl";

interface IFieldText {
  label: string;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  reactFormRegister?: any;
  flexColumns?: [number, number];
}

export const FieldText = memo((props: IFieldText) => {
  return (
    <InputGroup className="mb-2">
      <Col xs={`${props.flexColumns?.[0] || 2}`}>
        <InputGroup.Text>{props.label}</InputGroup.Text>
      </Col>
      <Col xs={`${props.flexColumns?.[1] || 10}`}>
        <FormControl
          defaultValue={props.defaultValue}
          disabled={!!props.disabled}
          autoComplete="off"
          placeholder={props.placeholder}
          {...props.reactFormRegister}
        />
      </Col>
    </InputGroup>
  );
});

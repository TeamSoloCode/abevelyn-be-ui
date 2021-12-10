import React, { memo } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl";

interface IFieldNumber {
  label: string;
  placeholder: string;
  defaultValue?: number;
  reactFormRegister: any;
}

export const FieldNumber = memo((props: IFieldNumber) => {
  return (
    <InputGroup className="mb-2">
      <Col xs="2">
        <InputGroup.Text>{props.label}</InputGroup.Text>
      </Col>
      <Col xs="10">
        <FormControl
          defaultValue={props.defaultValue ?? 0}
          placeholder={props.placeholder}
          {...props.reactFormRegister}
        />
      </Col>
    </InputGroup>
  );
});

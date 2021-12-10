import React, { memo } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl";

interface IFieldText {
  label: string;
  placeholder: string;
  reactFormRegister: any;
}

export const FieldText = memo((props: IFieldText) => {
  return (
    <InputGroup className="mb-2">
      <Col xs="2">
        <InputGroup.Text>{props.label}</InputGroup.Text>
      </Col>
      <Col xs="10">
        <FormControl autoComplete="off" placeholder={props.placeholder} {...props.reactFormRegister} />
      </Col>
    </InputGroup>
  );
});

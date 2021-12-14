import React, { memo } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl";
import Form from "react-bootstrap/Form";
import CurrencyInput from "react-currency-input-field";

interface IFieldNumber {
  label: string;
  placeholder: string;
  defaultValue?: number;
  decimalsLimit?: number;
  unit?: string;
  name: string;
  prefix?: string;
  suffix?: string;
  maxLength?: number;
  value?: number;
  onValueChange?: (value: string | undefined, name?: string) => void;
}

export const FieldNumber = memo((props: IFieldNumber) => {
  return (
    <InputGroup className="mb-2">
      <Col xs="2">
        <InputGroup.Text>
          {props.label} {props.unit ? `( ${props.unit} )` : ""}
        </InputGroup.Text>
      </Col>
      <Col xs="6">
        <CurrencyInput
          className="form-control"
          autoComplete="off"
          name={props.name}
          value={props.value}
          prefix={props.prefix}
          suffix={props.suffix}
          maxLength={props.maxLength}
          placeholder={props.placeholder}
          defaultValue={props.defaultValue}
          decimalsLimit={props.decimalsLimit}
          onValueChange={props.onValueChange}
        />
      </Col>
    </InputGroup>
  );
});

import React, { memo } from "react";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";

interface IFieldFile {
  label: string;
  placeholder: string;
  reactFormRegister: any;
  required?: boolean;
}

export const FieldFile = memo((props: IFieldFile) => {
  return (
    <InputGroup className="mb-2">
      <Col xs="2">
        <InputGroup.Text>{props.label}</InputGroup.Text>
      </Col>
      <Col xs="10">
        <FormControl
          type="file"
          required={props.required}
          name="file"
          placeholder={props.placeholder}
          {...props.reactFormRegister}
          //   onChange={handleChange}
          //   isInvalid={!!errors.file}
        />
      </Col>
    </InputGroup>
  );
});

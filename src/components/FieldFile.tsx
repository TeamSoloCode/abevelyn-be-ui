import React, { memo, useCallback, useState } from "react";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import Spinner from "react-bootstrap/Spinner";
import Form from "react-bootstrap/Form";
import { ClientApi, clientApi } from "../client-api/api.client";

interface IFieldFile {
  label: string;
  placeholder: string;
  reactFormRegister: any;
  required?: boolean;
  pathOnServer?: string;
  getUploadedFileURL?: (url: string) => void;
  onChange?: (e) => void;
}

export const FieldFile = memo((props: IFieldFile) => {
  const [loading, setLoading] = useState<boolean>(false);

  const onChange = useCallback(
    async (e) => {
      props?.onChange?.(e);
      const file = e?.target?.files?.[0];
      // if (file) {
      //   setLoading(true);
      //   const response = await clientApi.uploadImage(ClientApi.APIs.UPLOAD_IMAGE, file);
      //   const { filename } = await response.json();
      //   props.getUploadedFileURL?.call(this, filename);
      //   setLoading(false);
      // }
    },
    [props.onChange, props.pathOnServer, props.getUploadedFileURL]
  );

  return (
    <InputGroup className="mb-2">
      <Col xs="2">
        <InputGroup.Text>{props.label}</InputGroup.Text>
      </Col>
      <Col xs="9">
        <Form.Control
          type="file"
          required={props.required}
          name="file"
          placeholder={props.placeholder}
          onInput={onChange}
          {...props.reactFormRegister}
          //   onChange={handleChange}
          //   isInvalid={!!errors.file}
        />
      </Col>
      <Col xs="1">{loading && <Spinner animation="border" variant="success" />}</Col>
    </InputGroup>
  );
});

import React, { memo, useCallback, useMemo, useState } from "react";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import Spinner from "react-bootstrap/Spinner";
import Form from "react-bootstrap/Form";
import uploadImagePlaceholder from "../../assets/upload-image-placeholder.png";

interface IFieldFile {
  label: string;
  id?: string;
  placeholder?: string;
  defaultValue?: string;
  reactFormRegister?: any;
  required?: boolean;
  pathOnServer?: string;
  getUploadedFileURL?: (url: string) => void;
  onChange?: (e) => void;
  flexColumns?: [number, number, number];
  readonly?: boolean;
  imgWidth?: number;
  imgHeight?: number;
}

export const FieldFile = memo((props: IFieldFile) => {
  const [loading, setLoading] = useState<boolean>(false);
  const defaultId = useMemo(() => Date.now() + "", []);
  const [selectedImage, setSelectedImage] = useState<string>();
  console.log("abcd", selectedImage);
  const onChange = useCallback(
    async (e) => {
      props?.onChange?.(e);
      const file = e?.target?.files?.[0];
      file && setSelectedImage(URL.createObjectURL(new Blob([file])));
    },
    [props.onChange, props.pathOnServer, props.getUploadedFileURL]
  );

  return (
    <InputGroup className="field-file mb-2">
      <Col xs={`${props.flexColumns?.[0] || 2}`}>
        <InputGroup.Text>{props.label}</InputGroup.Text>
      </Col>
      <Col xs={`${props.flexColumns?.[1] || 9}`}>
        <Col>
          <img
            className="field-file__image"
            style={{ width: props.imgWidth, height: props.imgHeight }}
            src={selectedImage || props.defaultValue || uploadImagePlaceholder}
          />
        </Col>
        <Col>
          <Form.Label hidden={props.readonly} className="overflow-hidden" htmlFor={props.id || defaultId}>
            <div className="btn btn-primary">Change file</div>
          </Form.Label>
        </Col>
        <Form.Control
          key={defaultId}
          id={props.id || defaultId}
          hidden={true}
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
      <Col xs={`${props.flexColumns?.[2] || 1}`}>{loading && <Spinner animation="border" variant="success" />}</Col>
    </InputGroup>
  );
});

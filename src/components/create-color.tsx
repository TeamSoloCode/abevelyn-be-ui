import React, { memo, useCallback, useContext } from "react";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl";
import { SubmitHandler, useForm } from "react-hook-form";
import { ICreateColorReqDto } from "../dto/colors/create-color.req.dto";
import ColorContext from "../context/colors.context";

export const CreateColor = memo(() => {
  const colorContext = useContext(ColorContext);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ICreateColorReqDto>();

  const onSubmit: SubmitHandler<ICreateColorReqDto> = useCallback(
    ({ code, name }) => {
      if (!colorContext?.createColor) return;
      colorContext.createColor({ code, name });
    },
    [colorContext.createColor]
  );

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Row className="align-items-center">
        <Col xs="auto">
          <InputGroup className="mb-2">
            <InputGroup.Text>Color name</InputGroup.Text>
            <FormControl placeholder="Color name" {...register("name")} />
          </InputGroup>
        </Col>
        <Col xs="auto">
          <InputGroup className="mb-2">
            <InputGroup.Text>Code</InputGroup.Text>
            <FormControl placeholder="Code" {...register("code")} />
          </InputGroup>
        </Col>
        <Col xs="auto">
          <Button type="submit" className="mb-2">
            Submit
          </Button>
        </Col>
      </Row>
    </Form>
  );
});

import React, { memo, useCallback, useContext } from "react";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl";
import Modal from "react-bootstrap/Modal";
import { SubmitHandler, useForm } from "react-hook-form";
import SizeContext from "../context/size.context";
import { ICreateSizeReqDto } from "../dto/size/create-size.req.dto";

interface ICreateSize {
  show: boolean;
  close: () => void;
}

export const CreateSize = memo((props: ICreateSize) => {
  const sizeContext = useContext(SizeContext);
  const state = sizeContext?.state;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ICreateSizeReqDto>();

  const onSubmit: SubmitHandler<ICreateSizeReqDto> = useCallback(
    async ({ name }) => {
      const isSuccess = await sizeContext?.createSize({ name });
      isSuccess && props.close();
      reset();
    },
    [sizeContext?.createSize, props.close]
  );

  return (
    <Modal show={props.show} onHide={props.close}>
      <Modal.Dialog>
        <Modal.Header closeButton>
          <Modal.Title>Create New Size</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row className="align-items-center">
              <Col xs="auto">
                <InputGroup className="mb-2">
                  <InputGroup.Text>Size name</InputGroup.Text>
                  <FormControl placeholder="Size name" {...register("name")} />
                </InputGroup>
              </Col>
              <Col xs="auto">
                <Button type="submit" className="mb-2">
                  Submit
                </Button>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal.Dialog>
    </Modal>
  );
});

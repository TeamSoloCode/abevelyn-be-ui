import React, { memo, useCallback, useContext } from "react";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl";
import Modal from "react-bootstrap/Modal";
import { SubmitHandler, useForm } from "react-hook-form";
import ProductStatusContext from "../context/product-status.context";
import { ICreateProductStatusDto } from "../dto/product-status/create-product-status.req.dto";

interface ICreateProductStatus {
  show: boolean;
  close: () => void;
}

export const CreateProductStatus = memo((props: ICreateProductStatus) => {
  const productStatusContext = useContext(ProductStatusContext);
  const state = productStatusContext?.state;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ICreateProductStatusDto>();

  const onSubmit: SubmitHandler<ICreateProductStatusDto> = useCallback(
    async ({ name }) => {
      const isSuccess = await productStatusContext?.createProductStatus({ name });
      isSuccess && props.close();
      reset();
    },
    [productStatusContext?.createProductStatus, props.close]
  );

  return (
    <Modal show={props.show} onHide={props.close}>
      <Modal.Dialog>
        <Modal.Header closeButton>
          <Modal.Title>Create New Product Status</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row className="align-items-center">
              <Col xs="auto">
                <InputGroup className="mb-2">
                  <InputGroup.Text>Status name</InputGroup.Text>
                  <FormControl placeholder="Status name" {...register("name")} />
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

import React, { memo, useCallback, useContext } from "react";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl";
import Modal from "react-bootstrap/Modal";
import { SubmitHandler, useForm } from "react-hook-form";
import { ICreateMaterialDto } from "../../dto/materials/create-material.req.dto";
import MaterialContext from "../../context/material.context";

interface ICreateMaterial {}

export const CreateMaterial = memo((props: ICreateMaterial) => {
  const materialContext = useContext(MaterialContext);
  const state = materialContext?.state;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ICreateMaterialDto>();
  const onSubmit: SubmitHandler<ICreateMaterialDto> = useCallback(
    async ({ name }) => {
      const isSuccess = await materialContext?.createMaterial({ name });
      isSuccess && reset();
    },
    [materialContext?.createMaterial]
  );

  return (
    <Modal.Dialog>
      <Modal.Header closeButton>
        <Modal.Title>Create New Material</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row className="align-items-center">
            <Col xs="auto">
              <InputGroup className="mb-2">
                <InputGroup.Text>Material name</InputGroup.Text>
                <FormControl placeholder="Material name" {...register("name")} />
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
  );
});

import React, { memo, useCallback, useContext } from "react";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl";
import Modal from "react-bootstrap/Modal";
import { SubmitHandler, useForm } from "react-hook-form";
import { ICreateCollectionDto } from "../dto/collections/create-collection.req.dto";
import CollectionContext from "../context/collection.context";

interface ICreateCollection {
  show: boolean;
  close: () => void;
}

export const CreateCollection = memo((props: ICreateCollection) => {
  const collectionContext = useContext(CollectionContext);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ICreateCollectionDto>();

  const onSubmit: SubmitHandler<ICreateCollectionDto> = useCallback(
    async ({ available, name }) => {
      if (!collectionContext?.createCollection) return;
      const isSuccess = await collectionContext.createCollection({ available, name });
      isSuccess && props.close();
    },
    [collectionContext.createCollection, props.close]
  );

  return (
    <Modal show={props.show} onHide={props.close}>
      <Modal.Dialog>
        <Modal.Header closeButton>
          <Modal.Title>Create New Collection</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row className="align-items-center">
              <InputGroup className="mb-2">
                <InputGroup.Text>Color name</InputGroup.Text>
                <FormControl placeholder="Color name" {...register("name")} />
              </InputGroup>
              <InputGroup className="mb-2">
                <Form.Group className="mb-3">
                  <Form.Check type="checkbox" label="Available" {...register("available")} />
                </Form.Group>
              </InputGroup>
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

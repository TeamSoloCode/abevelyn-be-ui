import React, { memo, useCallback, useContext } from "react";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl";
import Modal from "react-bootstrap/Modal";
import { SubmitHandler, useForm } from "react-hook-form";
import { ICreateCollectionDto } from "../../dto/collections/create-collection.req.dto";
import CollectionContext from "../../context/collection.context";
import { FieldFile } from "../../components/FieldFile";
import { useNavigate } from "react-router";
import { AppRoutes } from "../../constanst";

interface ICreateCollection {}

export const CreateCollection = memo((props: ICreateCollection) => {
  const collectionContext = useContext(CollectionContext);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ICreateCollectionDto>();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<ICreateCollectionDto> = useCallback(
    async ({ name, image }) => {
      if (!collectionContext?.createCollection) return;
      const isSuccess = await collectionContext.createCollection({ name, image });
      reset();
    },
    [collectionContext.createCollection]
  );

  const back = () => {
    navigate("/" + AppRoutes.COLLECTIONS);
  };

  return (
    <Col xs="9">
      <Card className="m-1">
        <Card.Body>
          <Card.Title>Create New Collection</Card.Title>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row className="align-items-center">
              <InputGroup className="mb-2">
                <InputGroup.Text>Collection name</InputGroup.Text>
                <FormControl placeholder="Collection name" {...register("name")} />
              </InputGroup>
              <FieldFile label="Main Image" placeholder="Main Image" reactFormRegister={register("image")} />
            </Row>
            <hr />
            <Row>
              <Col xs="9"></Col>
              <Col xs="3">
                <Row>
                  <Col xs="6">
                    <Button type="submit" className="mb-2">
                      Submit
                    </Button>
                  </Col>
                  <Col xs="6">
                    <Button variant="danger" className="mb-2 ml-2" onClick={back}>
                      Close
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </Col>
  );
});

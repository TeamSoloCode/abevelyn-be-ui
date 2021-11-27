import React, { memo, useCallback, useContext, useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import { SubmitHandler, useForm } from "react-hook-form";
import { showError } from "../utils";
import CollectionContext from "../context/collection.context";
import { IUpdateCollectionDto } from "../dto/collections/update-collection.req.dto";
import { collectionApi } from "../client-api/api.client";

interface IUpdateCollection {
  show: boolean;
  close: () => void;
  collectionId: string;
}

export const UpdateCollection = memo((props: IUpdateCollection) => {
  const collectionContext = useContext(CollectionContext);
  const [selectedCollection, setSelectedCollection] = useState<IUpdateCollectionDto | null>(null);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IUpdateCollectionDto>();

  const onSubmit: SubmitHandler<IUpdateCollectionDto> = useCallback(
    async ({
      available,
      name,
      nameInFrench,
      nameInVietnames,
      description,
      descriptionInFrench,
      descriptionInVietnames,
    }) => {
      if (!collectionContext?.updateCollection) return;
      const isSuccess = await collectionContext.updateCollection(props.collectionId, {
        available,
        name,
        nameInFrench,
        nameInVietnames,
        description,
        descriptionInFrench,
        descriptionInVietnames,
      });
      isSuccess && props.close();
    },
    [collectionContext.createCollection, props.close, props.collectionId]
  );

  const openConfirm = useCallback(async () => {
    setShowAlert(true);
  }, [setShowAlert]);

  const onDelete = useCallback(async () => {
    if (!collectionContext?.deleteCollection) return;
    const isSuccess = await collectionContext.deleteCollection(props.collectionId);
    isSuccess && props.close();
  }, [props.collectionId, props.show]);

  useEffect(() => {
    if (!props.show) {
      return;
    }

    (async (id: string) => {
      const response = await collectionApi.fetchCollectionById(id);
      const result = await response.json();

      if (response.status == 200) {
        setSelectedCollection(result.data);
      }

      showError(result?.message);
    })(props.collectionId);

    setShowAlert(false);
  }, [props.collectionId, props.show]);

  if (!selectedCollection) {
    return <Spinner animation="border" variant="primary" />;
  }

  return (
    <Modal show={props.show} onHide={props.close}>
      <Modal.Dialog>
        <Modal.Header closeButton>
          <Modal.Title>Update Collection</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Col>
              <Row className="align-items-center">
                <InputGroup as={Col} className="mb-2">
                  <InputGroup.Text>Collection name</InputGroup.Text>
                  <FormControl
                    placeholder="Name"
                    {...register("name")}
                    {...setValue("name", selectedCollection.name)}
                  />
                </InputGroup>
                <InputGroup as={Col} className="mb-2">
                  <InputGroup.Text>Status</InputGroup.Text>
                  <FormControl
                    placeholder="available"
                    {...register("available")}
                    {...setValue("available", selectedCollection.available)}
                  />
                </InputGroup>
              </Row>
              <hr />
              <InputGroup className="mb-2">
                <InputGroup.Text>Name in French</InputGroup.Text>
                <FormControl
                  placeholder="Name in French"
                  {...register("nameInFrench")}
                  {...setValue("nameInFrench", selectedCollection.nameInFrench)}
                />
              </InputGroup>
              <InputGroup className="mb-2">
                <InputGroup.Text>Name in Vietnamese</InputGroup.Text>
                <FormControl
                  placeholder="Name in Vietnamese"
                  {...register("nameInVietnames")}
                  {...setValue("nameInVietnames", selectedCollection.nameInVietnames)}
                />
              </InputGroup>
              <hr />
              <InputGroup className="mb-2">
                <InputGroup.Text>Discription</InputGroup.Text>
                <FormControl
                  placeholder="Discription"
                  {...register("description")}
                  {...setValue("description", selectedCollection.description)}
                />
              </InputGroup>
              <InputGroup className="mb-2">
                <InputGroup.Text>Discription in French</InputGroup.Text>
                <FormControl
                  placeholder="Discription in French"
                  {...register("descriptionInFrench")}
                  {...setValue("descriptionInFrench", selectedCollection.descriptionInFrench)}
                />
              </InputGroup>
              <InputGroup className="mb-2">
                <InputGroup.Text>Discription in Vietnamese</InputGroup.Text>
                <FormControl
                  placeholder="Discription   in Vietnamese"
                  {...register("descriptionInVietnames")}
                  {...setValue("descriptionInVietnames", selectedCollection.descriptionInVietnames)}
                />
              </InputGroup>
              <Row>
                <Col>
                  <Button type="submit" className="mb-2">
                    Submit
                  </Button>
                </Col>
                <Col>
                  <Button className="mb-2" variant={"danger"} onClick={openConfirm}>
                    Delete
                  </Button>
                </Col>
              </Row>
            </Col>
          </Form>

          <>
            <Alert show={showAlert} variant="success" dismissible onClose={() => setShowAlert(false)}>
              <Alert.Heading>This action can not be undone !</Alert.Heading>
              <p>Are you sure to delete this Collection ?</p>
              <hr />
              <div className="d-flex justify-content-end">
                <Button onClick={() => setShowAlert(false)} variant="outline-danger">
                  Nope
                </Button>
                <Button onClick={onDelete} variant="outline-success">
                  Yes, I'm sure
                </Button>
              </div>
            </Alert>
          </>
        </Modal.Body>
      </Modal.Dialog>
    </Modal>
  );
});

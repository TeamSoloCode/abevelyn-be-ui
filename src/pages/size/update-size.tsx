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

import { showError } from "../../utils";
import SizeContext from "../../context/size.context";
import { IUpdateSizeReqDto } from "../../dto/size/update-size.req.dto";
import { sizeApi } from "../../client-api/api.client";
import {} from "react-select";

interface IUpdateSize {
  show: boolean;
  close: () => void;
  statusId: string;
}

export const UpdateSize = memo((props: IUpdateSize) => {
  const sizeContext = useContext(SizeContext);
  const [selectedSize, setSelectedSize] = useState<IUpdateSizeReqDto | null>(null);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<IUpdateSizeReqDto>();

  const onSubmit: SubmitHandler<IUpdateSizeReqDto> = useCallback(
    async ({
      name,
      nameInFrench,
      nameInVietnames,
      description,
      descriptionInFrench,
      descriptionInVietnames,
      available,
    }) => {
      const isSuccess = await sizeContext?.updateSize(props.statusId, {
        name,
        nameInFrench,
        nameInVietnames,
        description,
        descriptionInFrench,
        descriptionInVietnames,
        available,
      });
      reset();
      isSuccess && props.close();
    },
    [sizeContext?.updateSize, props.close, props.statusId]
  );

  const openConfirm = useCallback(async () => {
    setShowAlert(true);
  }, [setShowAlert]);

  const onDelete = useCallback(async () => {
    const isSuccess = await sizeContext?.deleteSize(props.statusId);
    isSuccess && props.close();
  }, [props.statusId, props.show]);

  useEffect(() => {
    if (!props.show) {
      return;
    }

    (async (id: string) => {
      const response = await sizeApi.fetchById(id);
      const result = await response.json();
      if (response.status == 200) {
        setSelectedSize(result?.data);
        return;
      }

      showError(result?.message);
    })(props.statusId);
    setShowAlert(false);
  }, [props.statusId, props.show]);

  if (!selectedSize) {
    return <Spinner animation="border" variant="primary" />;
  }

  return (
    <Modal show={props.show} onHide={props.close}>
      <Modal.Dialog>
        <Modal.Header closeButton>
          <Modal.Title>Update Product Status</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Col>
              <Row className="align-items-center">
                <InputGroup as={Col} className="mb-2">
                  <InputGroup.Text>Status name</InputGroup.Text>
                  <FormControl placeholder="Name" {...register("name")} {...setValue("name", selectedSize.name)} />
                </InputGroup>

                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                  <Form.Check
                    type="checkbox"
                    label="Available"
                    {...register("available")}
                    {...setValue("available", selectedSize.available)}
                  />
                </Form.Group>
              </Row>

              <InputGroup className="mb-2">
                <InputGroup.Text>Name in French</InputGroup.Text>
                <FormControl
                  placeholder="Name in French"
                  {...register("nameInFrench")}
                  {...setValue("nameInFrench", selectedSize.nameInFrench)}
                />
              </InputGroup>
              <InputGroup className="mb-2">
                <InputGroup.Text>Name in Vietnamese</InputGroup.Text>
                <FormControl
                  placeholder="Name in Vietnamese"
                  {...register("nameInVietnames")}
                  {...setValue("nameInVietnames", selectedSize.nameInVietnames)}
                />
              </InputGroup>
              <hr />
              <InputGroup className="mb-2">
                <InputGroup.Text>Description</InputGroup.Text>
                <FormControl
                  placeholder="Description"
                  {...register("description")}
                  {...setValue("description", selectedSize.description)}
                />
              </InputGroup>
              <InputGroup className="mb-2">
                <InputGroup.Text>Description in French</InputGroup.Text>
                <FormControl
                  placeholder="Description in French"
                  {...register("descriptionInFrench")}
                  {...setValue("descriptionInFrench", selectedSize.descriptionInFrench)}
                />
              </InputGroup>
              <InputGroup className="mb-2">
                <InputGroup.Text>Description in Vietnamese</InputGroup.Text>
                <FormControl
                  placeholder="Description   in Vietnamese"
                  {...register("descriptionInVietnames")}
                  {...setValue("descriptionInVietnames", selectedSize.descriptionInVietnames)}
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
              <p>Are you sure to delete this status ?</p>
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

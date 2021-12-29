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
import { productStatusApi } from "../../client-api/api.client";
import { SubmitHandler, useForm } from "react-hook-form";

import ProductStatusContext from "../../context/product-status.context";
import { showError } from "../../utils";
import { IUpdateProductStatusDto } from "../../dto/product-status/update-product-status.req.dto";

interface IUpdateProductStatus {
  show: boolean;
  close: () => void;
  statusId: string;
}

export const UpdateProductStatus = memo((props: IUpdateProductStatus) => {
  const productStatusContext = useContext(ProductStatusContext);
  const [selectedStatus, setSelectedStatus] = useState<IUpdateProductStatusDto | null>(null);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<IUpdateProductStatusDto>();

  const onSubmit: SubmitHandler<IUpdateProductStatusDto> = useCallback(
    async ({ name, nameInFrench, nameInVietnames }) => {
      const isSuccess = await productStatusContext?.updateProductStatus(props.statusId, {
        name,
        nameInFrench,
        nameInVietnames,
      });
      reset();
      isSuccess && props.close();
    },
    [productStatusContext?.updateProductStatus, props.close, props.statusId]
  );

  const openConfirm = useCallback(async () => {
    setShowAlert(true);
  }, [setShowAlert]);

  const onDelete = useCallback(async () => {
    const isSuccess = await productStatusContext?.deleteProductStatus(props.statusId);
    isSuccess && props.close();
  }, [props.statusId, props.show]);

  useEffect(() => {
    if (!props.show) {
      return;
    }

    (async (id: string) => {
      const response = await productStatusApi.fetchById(id);
      const result = await response.json();
      if (response.status == 200) {
        setSelectedStatus(result?.data);
        return;
      }

      showError(result?.message);
    })(props.statusId);
    setShowAlert(false);
  }, [props.statusId, props.show]);

  if (!selectedStatus) {
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
                  <FormControl placeholder="Name" {...register("name")} {...setValue("name", selectedStatus.name)} />
                </InputGroup>
              </Row>

              <InputGroup className="mb-2">
                <InputGroup.Text>Name in French</InputGroup.Text>
                <FormControl
                  placeholder="Name in French"
                  {...register("nameInFrench")}
                  {...setValue("nameInFrench", selectedStatus.nameInFrench)}
                />
              </InputGroup>
              <InputGroup className="mb-2">
                <InputGroup.Text>Name in Vietnamese</InputGroup.Text>
                <FormControl
                  placeholder="Name in Vietnamese"
                  {...register("nameInVietnames")}
                  {...setValue("nameInVietnames", selectedStatus.nameInVietnames)}
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

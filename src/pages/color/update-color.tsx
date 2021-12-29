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
import { colorApi } from "../../client-api/api.client";
import { SubmitHandler, useForm } from "react-hook-form";

import ColorContext from "../../context/colors.context";
import { IUpdateColorReqDto } from "../../dto/colors/update-color.req.dto";
import { showError } from "../../utils";

interface IUpdateColor {
  show: boolean;
  close: () => void;
  colorId: string;
}

export const UpdateColor = memo((props: IUpdateColor) => {
  const colorContext = useContext(ColorContext);
  const [selectedColor, setSelectedColor] = useState<IUpdateColorReqDto | null>(null);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<IUpdateColorReqDto>();

  const onSubmit: SubmitHandler<IUpdateColorReqDto> = useCallback(
    async ({ code, name, nameInFrench, nameInVietnames }) => {
      if (!colorContext?.updateColor) return;
      const isSuccess = await colorContext.updateColor(props.colorId, { code, name, nameInFrench, nameInVietnames });
      reset();
      isSuccess && props.close();
    },
    [colorContext.updateColor, props.close, props.colorId]
  );

  const openConfirm = useCallback(async () => {
    setShowAlert(true);
  }, [setShowAlert]);

  const onDelete = useCallback(async () => {
    if (!colorContext?.deleteColor) return;
    const isSuccess = await colorContext.deleteColor(props.colorId);
    isSuccess && props.close();
  }, [props.colorId, props.show]);

  useEffect(() => {
    if (!props.show) {
      return;
    }

    (async (id: string) => {
      const response = await colorApi.fetchById(id);
      const result = await response.json();

      if (response.status == 200) {
        setSelectedColor(result.data);
        return;
      }

      showError(result?.message);
    })(props.colorId);
    setShowAlert(false);
  }, [props.colorId, props.show]);

  if (!selectedColor) {
    return <Spinner animation="border" variant="primary" />;
  }

  return (
    <Modal show={props.show} onHide={props.close}>
      <Modal.Dialog>
        <Modal.Header closeButton>
          <Modal.Title>Update Color</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Col>
              <Row className="align-items-center">
                <InputGroup as={Col} className="mb-2">
                  <InputGroup.Text>Color name</InputGroup.Text>
                  <FormControl placeholder="Name" {...register("name")} {...setValue("name", selectedColor.name)} />
                </InputGroup>
                <InputGroup as={Col} className="mb-2">
                  <InputGroup.Text>Code</InputGroup.Text>
                  <FormControl placeholder="Code" {...register("code")} {...setValue("code", selectedColor.code)} />
                </InputGroup>
              </Row>

              <InputGroup className="mb-2">
                <InputGroup.Text>Name in French</InputGroup.Text>
                <FormControl
                  placeholder="Name in French"
                  {...register("nameInFrench")}
                  {...setValue("nameInFrench", selectedColor.nameInFrench)}
                />
              </InputGroup>
              <InputGroup className="mb-2">
                <InputGroup.Text>Name in Vietnamese</InputGroup.Text>
                <FormControl
                  placeholder="Name in Vietnamese"
                  {...register("nameInVietnames")}
                  {...setValue("nameInVietnames", selectedColor.nameInVietnames)}
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
              <p>Are you sure to delete this color ?</p>
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

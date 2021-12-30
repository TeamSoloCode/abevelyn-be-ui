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
import { materialApi } from "../../client-api/api.client";
import { SubmitHandler, useForm } from "react-hook-form";

import { showError } from "../../utils";
import MaterialContext from "../../context/material.context";
import { IUpdateMaterialDto } from "../../dto/materials/update-material.req.dto";

interface IUpdateMaterial {
  show: boolean;
  close: () => void;
  materialId: string;
}

export const UpdateMaterial = memo((props: IUpdateMaterial) => {
  const materialContext = useContext(MaterialContext);
  const [selectedMaterial, setSelectedMaterial] = useState<IUpdateMaterialDto | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<IUpdateMaterialDto>();

  const onSubmit: SubmitHandler<IUpdateMaterialDto> = useCallback(
    async ({ name, nameInFrench, nameInVietnames, description, descriptionInFrench, descriptionInVietnames }) => {
      const isSuccess = await materialContext?.updateMaterial(props.materialId, {
        name,
        nameInFrench,
        nameInVietnames,
        description,
        descriptionInFrench,
        descriptionInVietnames,
      });
      isSuccess && props.close();
    },
    [materialContext?.updateMaterial, props.close, props.materialId]
  );

  useEffect(() => {
    if (!props.show) {
      return;
    }

    (async (id: string) => {
      const response = await materialApi.fetchById(id);
      const result = await response.json();
      if (response.status == 200) {
        setSelectedMaterial(result?.data);
        return;
      }

      showError(result?.message);
    })(props.materialId);
  }, [props.materialId, props.show]);

  if (!selectedMaterial) {
    return <Spinner animation="border" variant="primary" />;
  }

  return (
    <Modal show={props.show} onHide={props.close}>
      <Modal.Dialog>
        <Modal.Header closeButton>
          <Modal.Title>Update Material</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Col>
              <InputGroup as={Col} className="mb-2">
                <InputGroup.Text>Material name</InputGroup.Text>
                <FormControl placeholder="Name" {...register("name")} {...setValue("name", selectedMaterial.name)} />
              </InputGroup>

              <InputGroup className="mb-2">
                <InputGroup.Text>Name in French</InputGroup.Text>
                <FormControl
                  placeholder="Name in French"
                  {...register("nameInFrench")}
                  {...setValue("nameInFrench", selectedMaterial.nameInFrench)}
                />
              </InputGroup>
              <InputGroup className="mb-2">
                <InputGroup.Text>Name in Vietnamese</InputGroup.Text>
                <FormControl
                  placeholder="Name in Vietnamese"
                  {...register("nameInVietnames")}
                  {...setValue("nameInVietnames", selectedMaterial.nameInVietnames)}
                />
              </InputGroup>
              <hr />
              <InputGroup as={Col} className="mb-2">
                <InputGroup.Text>Description</InputGroup.Text>
                <FormControl
                  placeholder="Description"
                  {...register("description")}
                  {...setValue("description", selectedMaterial.description)}
                />
              </InputGroup>

              <InputGroup className="mb-2">
                <InputGroup.Text>Description in French</InputGroup.Text>
                <FormControl
                  placeholder="Description in French"
                  {...register("descriptionInFrench")}
                  {...setValue("descriptionInFrench", selectedMaterial.descriptionInFrench)}
                />
              </InputGroup>
              <InputGroup className="mb-2">
                <InputGroup.Text>Description in Vietnamese</InputGroup.Text>
                <FormControl
                  placeholder="Description in Vietnamese"
                  {...register("descriptionInVietnames")}
                  {...setValue("descriptionInVietnames", selectedMaterial.descriptionInVietnames)}
                />
              </InputGroup>
              <Row>
                <Col>
                  <Button type="submit" className="mb-2">
                    Submit
                  </Button>
                </Col>
                <Col></Col>
              </Row>
            </Col>
          </Form>
        </Modal.Body>
      </Modal.Dialog>
    </Modal>
  );
});

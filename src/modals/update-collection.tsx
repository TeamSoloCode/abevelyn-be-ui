import React, { memo, useCallback, useContext, useEffect, useMemo, useState } from "react";
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
import { collectionApi, saleApi } from "../client-api/api.client";
import { FieldNumber } from "../components/FieldNumber";
import { FieldSelect, Option } from "../components/FieldSelect";
import { AppRoutes } from "../constanst";
import { SingleValue } from "react-select";
import { Collection } from "../models/collection.model";

interface IUpdateCollection {
  show: boolean;
  close: () => void;
  collectionId: string;
}

export const UpdateCollection = memo((props: IUpdateCollection) => {
  const collectionContext = useContext(CollectionContext);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
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
      saleIds,
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
        saleIds,
      });
      isSuccess && props.close();
    },
    [collectionContext.createCollection, props.close, props.collectionId]
  );

  const defaultSales = useMemo<(string | undefined)[]>(() => {
    const sales = selectedCollection?.sales || [];
    return sales?.map((col) => col.uuid);
  }, [selectedCollection]);

  const openConfirm = useCallback(async () => {
    setShowAlert(true);
  }, [setShowAlert]);

  const onOpenSaleMenuOption = () => {
    return saleApi.loadDataAsOption();
  };

  const loadSaleOptions = useCallback(async (inputValue: string, callback: (options: Option[]) => void) => {
    const options = await saleApi.loadDataAsOption();
    const filteredOptions = options.filter((op) =>
      op.label.toLocaleLowerCase().includes(inputValue.toLocaleLowerCase())
    );
    callback(filteredOptions);
  }, []);

  const onChangeSales = useCallback(
    (newOption: SingleValue<Option>[]) => {
      setValue(
        "saleIds",
        (newOption || []).map((option) => option.value)
      );
    },
    [setValue]
  );

  useEffect(() => {
    if (!props.show) {
      return;
    }

    (async (id: string) => {
      const response = await collectionApi.fetchById(id);
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
                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                  <Form.Check
                    type="checkbox"
                    label="Available"
                    {...register("available")}
                    {...setValue("available", selectedCollection?.available)}
                  />
                </Form.Group>
              </Row>

              <FieldSelect
                label="Sales"
                placeholder="Select sale"
                loadDataFunction={onOpenSaleMenuOption}
                loadOnMount={true}
                isMulti
                defaultValue={defaultSales}
                addNewURL={AppRoutes.CREATE_SALE}
                loadOptions={loadSaleOptions}
                onChange={onChangeSales}
              />
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
                <InputGroup.Text>Description</InputGroup.Text>
                <FormControl
                  placeholder="Description"
                  {...register("description")}
                  {...setValue("description", selectedCollection.description)}
                />
              </InputGroup>
              <InputGroup className="mb-2">
                <InputGroup.Text>Description in French</InputGroup.Text>
                <FormControl
                  placeholder="Description in French"
                  {...register("descriptionInFrench")}
                  {...setValue("descriptionInFrench", selectedCollection.descriptionInFrench)}
                />
              </InputGroup>
              <InputGroup className="mb-2">
                <InputGroup.Text>Description in Vietnamese</InputGroup.Text>
                <FormControl
                  placeholder="Description   in Vietnamese"
                  {...register("descriptionInVietnames")}
                  {...setValue("descriptionInVietnames", selectedCollection.descriptionInVietnames)}
                />
              </InputGroup>
              <Row>
                <Col className="">
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

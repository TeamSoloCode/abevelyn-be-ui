import React, { memo, useCallback, useContext, useEffect, useMemo, useState } from "react";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import { SubmitHandler, useForm } from "react-hook-form";
import { SingleValue } from "react-select";
import CollectionContext from "../../context/collection.context";
import { Collection } from "../../models/collection.model";
import { IUpdateCollectionDto } from "../../dto/collections/update-collection.req.dto";
import { ClientApi, clientApi, collectionApi, saleApi } from "../../client-api/api.client";
import { AppRoutes, SaleType } from "../../constanst";
import { FieldSelect, Option } from "../../components/FieldSelect";
import { showError } from "../../utils";
import { FieldFile } from "../../components/FieldFile";
import { useParams } from "react-router";

interface IUpdateCollection {}

export const UpdateCollection = memo((props: IUpdateCollection) => {
  const collectionContext = useContext(CollectionContext);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const { collectionId = "" } = useParams();
  const [refreshToken, setRefreshToken] = React.useState(Date.now());
  const {
    register,
    handleSubmit,
    setValue,
    reset,
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
      image,
    }) => {
      if (!collectionContext?.updateCollection || !collectionId) return;

      const isSuccess = await collectionContext.updateCollection(collectionId, {
        available,
        name,
        nameInFrench,
        nameInVietnames,
        description,
        descriptionInFrench,
        descriptionInVietnames,
        saleIds,
        image: image?.[0] ?? selectedCollection?.image,
      });

      isSuccess && setRefreshToken(Date.now());
    },
    [collectionContext.createCollection, collectionId, selectedCollection]
  );

  const defaultSales = useMemo<(string | undefined)[]>(() => {
    const sales = selectedCollection?.sales || [];
    return sales?.map((col) => col.uuid);
  }, [selectedCollection]);

  const onOpenSaleMenuOption = () => {
    return saleApi.loadOptionByType(SaleType.COLLECTION);
  };

  const loadSaleOptions = useCallback(async (inputValue: string, callback: (options: Option[]) => void) => {
    const options = await saleApi.loadOptionByType(SaleType.COLLECTION);
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
    if (!collectionId) return;

    (async (id: string) => {
      const response = await collectionApi.fetchById(id);
      const result = await response.json();

      if (response.status == 200) {
        setSelectedCollection(result.data);
      }

      showError(result?.message);
    })(collectionId);
  }, [collectionId, refreshToken]);

  if (!selectedCollection) {
    return <Spinner animation="border" variant="primary" />;
  }

  return (
    <Col xs="9">
      <Card className="m-1">
        <Card.Body>
          <Card.Title>Update Collection</Card.Title>
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
              <hr />
              <FieldFile
                label="Main Image"
                placeholder="Main Image"
                defaultValue={
                  selectedCollection?.image
                    ? clientApi.getImageURLByName(ClientApi.APIs.FETCH_IMAGE, selectedCollection?.image)
                    : undefined
                }
                reactFormRegister={register("image")}
              />
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
        </Card.Body>
      </Card>
    </Col>
  );
});

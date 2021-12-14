import React, { memo, useCallback, useContext, useEffect, useMemo, useState } from "react";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
import { SubmitHandler, useForm } from "react-hook-form";
import ProductContext from "../../context/product.context";
import { FieldSelect, Option } from "../../components/FieldSelect";
import {
  ClientApi,
  clientApi,
  collectionApi,
  colorApi,
  productApi,
  productStatusApi,
  sizeApi,
} from "../../client-api/api.client";
import { IUpdateProductDto } from "../../dto/product/update-product-req-dto";
import { SingleValue } from "react-select";
import { FieldText } from "../../components/FieldText";
import { FieldNumber } from "../../components/FieldNumber";
import { AppRoutes } from "../../constanst";
import { FieldFile } from "../../components/FieldFile";
import { useNavigate, useParams } from "react-router-dom";
import { Product } from "../../models/product.model";
import { findOptionByValue, showError } from "../../utils";

interface IUpdateProduct {}

export const UpdateProduct = memo((props: IUpdateProduct) => {
  const productContext = useContext(ProductContext);
  const navigate = useNavigate();
  let { productId } = useParams();
  const [selectedProduct, setSelectedProduct] = useState<Product>();
  const [refreshKey, setRefreshKey] = useState(Date.now());
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<IUpdateProductDto>();

  const backToProduct = () => {
    // navigate("/" + AppRoutes.PRODUCTS);
    setRefreshKey(Date.now());
  };

  const onSubmit: SubmitHandler<IUpdateProductDto> = useCallback(
    async ({
      name,
      colorId,
      statusId,
      sizeId,
      price,
      description,
      image,
      image1,
      image2,
      image3,
      image4,
      image5,
      quantity,
      colectionId,
    }) => {
      if (!productId) return;
      const isSuccess = await productContext?.updateProduct(productId, {
        name,
        colorId,
        statusId,
        sizeId,
        price,
        description,
        quantity,
        colectionId,
        image: image[0] ?? selectedProduct?.image,
        image1: image1?.[0] ?? selectedProduct?.image1,
        image2: image2?.[0] ?? selectedProduct?.image2,
        image3: image3?.[0] ?? selectedProduct?.image3,
        image4: image4?.[0] ?? selectedProduct?.image4,
        image5: image5?.[0] ?? selectedProduct?.image5,
      });
      if (isSuccess) {
        backToProduct();
        reset();
        setSelectedProduct(undefined);
      }
    },
    [productContext?.createProduct, productId, selectedProduct]
  );

  useEffect(() => {
    if (!productId) return;

    (async (id: string) => {
      const response = await productApi.fetchById(id);
      const result = await response.json();

      if (response.status == 200) {
        setSelectedProduct(result.data);
      }

      showError(result?.message);
    })(productId);
  }, [productId, refreshKey]);

  const loadColorOptions = useCallback(async (inputValue: string, callback: (options: Option[]) => void) => {
    const options = await colorApi.loadColorAsOption();
    const filteredOptions = options.filter((op) =>
      op.label.toLocaleLowerCase().includes(inputValue.toLocaleLowerCase())
    );
    callback(filteredOptions);
  }, []);

  const loadStatusOptions = useCallback(async (inputValue: string, callback: (options: Option[]) => void) => {
    const options = await productStatusApi.loadProducStatusAsOption();
    const filteredOptions = options.filter((op) =>
      op.label.toLocaleLowerCase().includes(inputValue.toLocaleLowerCase())
    );
    callback(filteredOptions);
  }, []);

  const loadSizeOptions = useCallback(async (inputValue: string, callback: (options: Option[]) => void) => {
    const options = await sizeApi.loadSizeAsOption();
    const filteredOptions = options.filter((op) =>
      op.label.toLocaleLowerCase().includes(inputValue.toLocaleLowerCase())
    );
    callback(filteredOptions);
  }, []);

  const loadCollectionOptions = useCallback(async (inputValue: string, callback: (options: Option[]) => void) => {
    const options = await collectionApi.loadCollectionAsOption();
    const filteredOptions = options.filter((op) =>
      op.label.toLocaleLowerCase().includes(inputValue.toLocaleLowerCase())
    );
    callback(filteredOptions);
  }, []);

  const onOpenColorMenuOption = () => {
    return colorApi.loadColorAsOption();
  };

  const onOpenSizeMenuOption = () => {
    return sizeApi.loadSizeAsOption();
  };

  const onOpenCollectionMenuOption = () => {
    return collectionApi.loadCollectionAsOption();
  };

  const onOpenStatusMenuOption = () => {
    return productStatusApi.loadProducStatusAsOption();
  };

  const onChangeStatus = useCallback(
    (newOption: SingleValue<Option>) => {
      newOption?.value && setValue("statusId", newOption?.value);
    },
    [setValue]
  );

  const onChangeCollection = useCallback(
    (newOption: SingleValue<Option>) => {
      newOption?.value && setValue("colectionId", newOption?.value);
    },
    [setValue]
  );

  const onChangeColor = useCallback(
    (newOption: SingleValue<Option>) => {
      newOption?.value && setValue("colorId", newOption?.value);
    },
    [setValue]
  );

  const onChangeSize = useCallback(
    (newOption: SingleValue<Option>) => {
      newOption?.value && setValue("sizeId", newOption?.value);
    },
    [setValue]
  );

  const onPriceChange = useCallback((value?: string, name?: string) => {
    setValue("price", value ? Number(value) : 0);
  }, []);

  const onQuantityChange = useCallback((value?: string, name?: string) => {
    setValue("quantity", value ? Number(value) : 0);
  }, []);

  const setDefaultFieldEffect = (defaulValue: any, name: keyof IUpdateProductDto): any => {
    setValue(name, defaulValue);
    return defaulValue;
  };

  if (!selectedProduct) {
    return <Spinner animation="border" variant="primary" />;
  }

  return (
    <Col xs="9">
      <Card className="m-1">
        <Card.Body>
          <Card.Title>Update Product</Card.Title>
          <Form onSubmit={handleSubmit(onSubmit)}>
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
                    <Button variant="secondary" className="mb-2 ml-2" onClick={backToProduct}>
                      Reset
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
            <hr />
            <Row className="align-items-center">
              <FieldText
                label="Name"
                placeholder="Name"
                reactFormRegister={{ ...register("name"), ...setValue("name", selectedProduct?.name) }}
              />
              <FieldNumber
                label="Price"
                name="price"
                defaultValue={setDefaultFieldEffect(selectedProduct?.price, "price")}
                placeholder="Price"
                unit="USD"
                prefix="$"
                maxLength={7}
                onValueChange={onPriceChange}
              />
              <FieldNumber
                label="Quantity"
                name="quantity"
                defaultValue={setDefaultFieldEffect(selectedProduct?.quantity, "quantity")}
                placeholder="Quantity"
                maxLength={7}
                onValueChange={onQuantityChange}
              />
              <FieldText
                label="Description"
                placeholder="Description"
                reactFormRegister={{
                  ...register("description"),
                  ...setValue("description", selectedProduct?.description),
                }}
              />

              <hr />
              <Row>
                <Col>
                  <FieldSelect
                    label="Status"
                    placeholder="Select Status"
                    loadDataFunction={onOpenStatusMenuOption}
                    loadOnMount={true}
                    defaultValue={selectedProduct?.productStatus?.uuid}
                    addNewURL={AppRoutes.CREATE_PRODUCT_STATUS}
                    loadOptions={loadStatusOptions}
                    onChange={onChangeStatus}
                  />
                </Col>
                <Col>
                  <FieldSelect
                    label="Color"
                    placeholder="Select Color"
                    loadDataFunction={onOpenColorMenuOption}
                    loadOnMount={true}
                    defaultValue={selectedProduct?.color?.uuid}
                    addNewURL={AppRoutes.CREATE_COLORS}
                    loadOptions={loadColorOptions}
                    onChange={onChangeColor}
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <FieldSelect
                    label="Collection"
                    placeholder="Select Collection"
                    loadDataFunction={onOpenCollectionMenuOption}
                    loadOnMount={true}
                    defaultValue={selectedProduct?.collections?.[0]?.uuid}
                    addNewURL={AppRoutes.COLLECTIONS}
                    loadOptions={loadCollectionOptions}
                    onChange={onChangeCollection}
                  />
                </Col>
                <Col>
                  <FieldSelect
                    label="Size"
                    placeholder="Select Size"
                    loadDataFunction={onOpenSizeMenuOption}
                    loadOnMount={true}
                    defaultValue={selectedProduct?.size?.uuid}
                    addNewURL={AppRoutes.CREATE_SIZE}
                    onChange={onChangeSize}
                    loadOptions={loadSizeOptions}
                  />
                </Col>
              </Row>
              <hr />
              <FieldFile
                label="Main Image"
                placeholder="Main Image"
                defaultValue={
                  selectedProduct?.image
                    ? clientApi.getImageURLByName(ClientApi.APIs.FETCH_IMAGE, selectedProduct?.image)
                    : undefined
                }
                reactFormRegister={{ ...register("image") }}
              />
              <FieldFile
                label="Image 1"
                placeholder="Main Image"
                defaultValue={
                  selectedProduct?.image1
                    ? clientApi.getImageURLByName(ClientApi.APIs.FETCH_IMAGE, selectedProduct?.image1)
                    : undefined
                }
                reactFormRegister={{ ...register("image1") }}
              />
              <FieldFile
                label="Image 2"
                placeholder="Main Image"
                defaultValue={
                  selectedProduct?.image2
                    ? clientApi.getImageURLByName(ClientApi.APIs.FETCH_IMAGE, selectedProduct?.image2)
                    : undefined
                }
                reactFormRegister={{ ...register("image2") }}
              />
              <FieldFile
                label="Image 3"
                placeholder="Main Image"
                defaultValue={
                  selectedProduct?.image3
                    ? clientApi.getImageURLByName(ClientApi.APIs.FETCH_IMAGE, selectedProduct?.image3)
                    : undefined
                }
                reactFormRegister={{ ...register("image3") }}
              />
              <FieldFile
                label="Image 4"
                placeholder="Main Image"
                defaultValue={
                  selectedProduct?.image4
                    ? clientApi.getImageURLByName(ClientApi.APIs.FETCH_IMAGE, selectedProduct?.image4)
                    : undefined
                }
                reactFormRegister={{ ...register("image4") }}
              />
              <FieldFile
                label="Image 5"
                placeholder="Main Image"
                defaultValue={
                  selectedProduct?.image5
                    ? clientApi.getImageURLByName(ClientApi.APIs.FETCH_IMAGE, selectedProduct?.image5)
                    : undefined
                }
                reactFormRegister={{ ...register("image5") }}
              />
              <Row>
                <Col xs="9"></Col>
                <Col xs="3"></Col>
              </Row>
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
                    <Button variant="secondary" className="mb-2 ml-2" onClick={backToProduct}>
                      Reset
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

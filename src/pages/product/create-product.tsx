import React, { memo, useCallback, useContext, useEffect, useMemo, useState } from "react";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import { SubmitHandler, useForm } from "react-hook-form";
import ProductContext from "../../context/product.context";
import { ICreateProductDto } from "../../dto/product/create-product-req.dto";
import { FieldSelect, Option } from "../../components/FieldSelect";
import { colorApi, productStatusApi, sizeApi } from "../../client-api/api.client";
import { SingleValue } from "react-select";
import { FieldText } from "../../components/FieldText";
import { FieldNumber } from "../../components/FieldNumber";
import { AppRoutes } from "../../constanst";
import { FieldFile } from "../../components/FieldFile";

interface ICreateProduct {}

export const CreateProduct = memo((props: ICreateProduct) => {
  const productContext = useContext(ProductContext);
  const state = productContext?.state;
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ICreateProductDto>();
  const [colorOptions, setColorOptions] = useState<Option[]>([]);
  const [statusOptions, setStatusOptions] = useState<Option[]>([]);
  const [sizeOptions, setSizeOptions] = useState<Option[]>([]);

  const onSubmit: SubmitHandler<ICreateProductDto> = useCallback(
    async ({ name, colorId, statusId, sizeId, price, description, image }) => {
      const isSuccess = await productContext?.createProduct({
        name,
        colorId,
        statusId,
        sizeId,
        price,
        description,
        image,
      });
      console.log({ name, colorId, statusId, sizeId, price, description, image });
      if (isSuccess) {
        reset();
      }
    },
    [productContext?.createProduct]
  );

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

  const onOpenColorMenuOption = async () => {
    const colorOptions = await colorApi.loadColorAsOption();
    setColorOptions(colorOptions);
  };

  const onOpenSizeMenuOption = async () => {
    const sizesOptions = await sizeApi.loadSizeAsOption();
    setSizeOptions(sizesOptions);
  };

  const onOpenStatusMenuOption = async () => {
    const statusOptions = await productStatusApi.loadProducStatusAsOption();
    setStatusOptions(statusOptions);
  };

  const onChangeStatus = useCallback(
    (newOption: SingleValue<Option>) => {
      newOption?.value && setValue("statusId", newOption?.value);
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

  return (
    <Card className="m-1">
      <Card.Body>
        <Card.Title>Create New Product</Card.Title>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row className="align-items-center">
            <FieldText label="Name" placeholder="Name" reactFormRegister={register("name")} />
            <FieldNumber
              label="Price"
              defaultValue={0}
              placeholder="Price"
              reactFormRegister={register("price", { valueAsNumber: true })}
            />
            <FieldText label="Description" placeholder="Description" reactFormRegister={register("description")} />
            <hr />
            <FieldSelect
              label="Status"
              placeholder="Select Status"
              addNewURL={AppRoutes.CREATE_PRODUCT_STATUS}
              options={statusOptions}
              onMenuOpen={onOpenStatusMenuOption}
              loadOptions={loadStatusOptions}
              onChange={onChangeStatus}
            />
            <FieldSelect
              label="Color"
              placeholder="Select Color"
              addNewURL={AppRoutes.CREATE_COLORS}
              onMenuOpen={onOpenColorMenuOption}
              options={colorOptions}
              loadOptions={loadColorOptions}
              onChange={onChangeColor}
            />
            <FieldSelect
              label="Size"
              placeholder="Select Size"
              addNewURL={AppRoutes.CREATE_SIZE}
              options={sizeOptions}
              onMenuOpen={onOpenSizeMenuOption}
              loadOptions={loadSizeOptions}
              onChange={onChangeSize}
            />
            <hr />
            <FieldFile label="Main Image" placeholder="Main Image" reactFormRegister={register("image")} />
          </Row>
          <hr />
          <Row>
            <Button type="submit" className="mb-2">
              Submit
            </Button>
          </Row>
        </Form>
      </Card.Body>
    </Card>
  );
});

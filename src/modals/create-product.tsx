import React, { memo, useCallback, useContext, useEffect, useMemo, useState } from "react";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl";
import Modal from "react-bootstrap/Modal";
import { SubmitHandler, useForm } from "react-hook-form";
import ProductContext from "../context/product.context";
import { ICreateProductDto } from "../dto/product/create-product-req.dto";
import { AsyncSelection, Option } from "../components/AsyncSelection";
import { colorApi, productStatusApi } from "../client-api/api.client";
import { Color } from "../models/color.model";
import { showError } from "../utils";
import debounce from "lodash.debounce";
import { SingleValue } from "react-select";

interface ICreateProduct {
  show: boolean;
  close: () => void;
}

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

  const onSubmit: SubmitHandler<ICreateProductDto> = useCallback(
    async ({ name, colorId, statusId, sizeId }) => {
      //   const isSuccess = await productContext?.createProduct({ name });
      //   isSuccess && props.close();
      console.log({ name, colorId, statusId, sizeId });
      //   reset();
    },
    [productContext?.createProduct, props.close]
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

  useEffect(() => {
    if (!props.show) return;
    (async () => {
      const colorOptions = await colorApi.loadColorAsOption();
      setColorOptions(colorOptions);
      const statusOptions = await productStatusApi.loadProducStatusAsOption();
      setStatusOptions(statusOptions);
    })();
  }, [setColorOptions, props.show]);

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

  return (
    <Modal show={props.show} onHide={props.close}>
      <Modal.Dialog>
        <Modal.Header closeButton>
          <Modal.Title>Create New Product</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row className="align-items-center">
              <InputGroup className="mb-2">
                <InputGroup.Text>Name</InputGroup.Text>
                <FormControl placeholder="Name" {...register("name")} />
              </InputGroup>

              <InputGroup className="mb-2 w-100">
                <InputGroup.Text>Status</InputGroup.Text>
                <AsyncSelection
                  // defaultValue={options[0]}
                  options={statusOptions}
                  loadOptions={loadStatusOptions}
                  onChange={onChangeStatus}
                />
              </InputGroup>

              <InputGroup className="mb-2 w-100">
                <InputGroup.Text>Color</InputGroup.Text>
                <AsyncSelection
                  // defaultValue={options[0]}
                  options={colorOptions}
                  loadOptions={loadColorOptions}
                  onChange={onChangeColor}
                />
              </InputGroup>
            </Row>
            <Row>
              <Button type="submit" className="mb-2">
                Submit
              </Button>
            </Row>
          </Form>
        </Modal.Body>
      </Modal.Dialog>
    </Modal>
  );
});

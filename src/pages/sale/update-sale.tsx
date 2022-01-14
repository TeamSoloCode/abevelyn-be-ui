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
import moment from "moment";

import { showError } from "../../utils";
import SaleContext from "../../context/sale.context";
import { IUpdateSaleDto } from "../../dto/sales/update-sale.dto";
import { saleApi } from "../../client-api/api.client";
import { FieldNumber } from "../../components/FieldNumber";
import { FieldSelect, Option } from "../../components/FieldSelect";
import { SingleValue } from "react-select";
import { FieldDate } from "../../components/FieldDate";

interface IUpdateSale {
  show: boolean;
  close: () => void;
  saleId: string;
}

export const UpdateSale = memo((props: IUpdateSale) => {
  const saleContext = useContext(SaleContext);
  const [selectedSale, setSelectedSale] = useState<IUpdateSaleDto | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<IUpdateSaleDto>();

  const onSubmit: SubmitHandler<IUpdateSaleDto> = useCallback(
    async ({
      name,
      nameInFrench,
      nameInVietnamese,
      description,
      descriptionInFrench,
      descriptionInVietnamese,
      applyPrice,
      saleOff,
      unit,
      expiredDate,
      startedDate,
    }) => {
      const isSuccess = await saleContext?.updateSale(props.saleId, {
        name,
        nameInFrench,
        nameInVietnamese,
        description,
        descriptionInFrench,
        descriptionInVietnamese,
        applyPrice,
        saleOff,
        unit,
        expiredDate: moment(expiredDate).utc().toISOString(),
        startedDate: moment(startedDate).utc().toISOString(),
      });
      isSuccess && props.close();
    },
    [saleContext?.updateSale, props.close, props.saleId]
  );

  useEffect(() => {
    if (!props.show) {
      return;
    }

    (async (id: string) => {
      const response = await saleApi.fetchById(id);
      const result = await response.json();
      if (response.status == 200) {
        setSelectedSale(result?.data);
        return;
      }

      showError(result?.message);
    })(props.saleId);
  }, [props.saleId, props.show]);

  const onNumberChange = useCallback((value: string | undefined, name: keyof IUpdateSaleDto) => {
    setValue(name, value ? Number(value) : 0);
  }, []);

  const setDefaultFieldEffect = (defaulValue: any, name: keyof IUpdateSaleDto): any => {
    setValue(name, defaulValue);
    return defaulValue;
  };

  const onChangeSaleUnit = useCallback(
    (newOption: SingleValue<Option>) => {
      newOption?.value && setValue("unit", newOption?.value, {});
    },
    [setValue]
  );

  const onStartDateChange = useCallback(
    (date: Date | [Date | null, Date | null] | null, event: React.SyntheticEvent<any, Event> | undefined) => {
      if (date instanceof Date) {
        setValue("startedDate", date.toISOString());
      }
    },
    []
  );

  const onExpDateChange = useCallback(
    (date: Date | [Date | null, Date | null] | null, event: React.SyntheticEvent<any, Event> | undefined) => {
      if (date instanceof Date) {
        setValue("expiredDate", date.toISOString());
      }
    },
    []
  );

  if (!selectedSale) {
    return <Spinner animation="border" variant="primary" />;
  }
  const startedDate = selectedSale?.startedDate
    ? moment(selectedSale?.startedDate).toDate()
    : selectedSale?.startedDate;
  return (
    <Modal show={props.show} onHide={props.close}>
      <Modal.Dialog className="w-100">
        <Modal.Header closeButton>
          <Modal.Title>Update Sale</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Col>
              <FieldSelect
                label="Unit"
                placeholder="Select Unit"
                defaultValue={selectedSale.unit}
                options={[
                  { value: "%", label: "Percentage (%)" },
                  { value: "usd", label: "USD" },
                ]}
                onChange={onChangeSaleUnit}
              />
              <FieldNumber
                label="Sale"
                name="saleOff"
                defaultValue={setDefaultFieldEffect(selectedSale?.saleOff, "saleOff")}
                placeholder="Sale"
                onValueChange={onNumberChange}
              />

              <FieldNumber
                label="Max Off"
                name="applyPrice"
                defaultValue={setDefaultFieldEffect(selectedSale?.applyPrice, "applyPrice")}
                placeholder="Max Off"
                unit="USD"
                onValueChange={onNumberChange}
              />
              <hr />
              <FieldDate
                label="Start Date"
                name="startDate"
                onValueChange={onStartDateChange}
                defaultValue={setDefaultFieldEffect(startedDate, "startedDate")}
                showTimeInput
                timeInputLabel="Time:"
                dateFormat="MM/dd/yyyy h:mm aa"
                minDate={new Date()}
              />
              <FieldDate
                label="Expired Date"
                name="expiredDate"
                onValueChange={onExpDateChange}
                defaultValue={setDefaultFieldEffect(
                  selectedSale?.expiredDate ? moment(selectedSale?.expiredDate).toDate() : selectedSale?.expiredDate,
                  "expiredDate"
                )}
                showTimeInput
                timeInputLabel="Time:"
                dateFormat="MM/dd/yyyy h:mm aa"
                minDate={moment(startedDate || new Date()).toDate()}
              />
              <hr />
              <InputGroup as={Col} className="mb-2">
                <InputGroup.Text>Sale name</InputGroup.Text>
                <FormControl placeholder="Name" {...register("name")} {...setValue("name", selectedSale.name)} />
              </InputGroup>

              <InputGroup className="mb-2">
                <InputGroup.Text>Name in French</InputGroup.Text>
                <FormControl
                  placeholder="Name in French"
                  {...register("nameInFrench")}
                  {...setValue("nameInFrench", selectedSale.nameInFrench)}
                />
              </InputGroup>
              <InputGroup className="mb-2">
                <InputGroup.Text>Name in Vietnamese</InputGroup.Text>
                <FormControl
                  placeholder="Name in Vietnamese"
                  {...register("nameInVietnamese")}
                  {...setValue("nameInVietnamese", selectedSale.nameInVietnamese)}
                />
              </InputGroup>
              <hr />
              <InputGroup as={Col} className="mb-2">
                <InputGroup.Text>Description</InputGroup.Text>
                <FormControl
                  placeholder="Description"
                  {...register("description")}
                  {...setValue("description", selectedSale.description)}
                />
              </InputGroup>
              <InputGroup className="mb-2">
                <InputGroup.Text>Description in French</InputGroup.Text>
                <FormControl
                  placeholder="Description in French"
                  {...register("descriptionInFrench")}
                  {...setValue("descriptionInFrench", selectedSale.descriptionInFrench)}
                />
              </InputGroup>
              <InputGroup className="mb-2">
                <InputGroup.Text>Description in Vietnamese</InputGroup.Text>
                <FormControl
                  placeholder="Description in Vietnamese"
                  {...register("descriptionInVietnamese")}
                  {...setValue("descriptionInVietnamese", selectedSale.descriptionInVietnamese)}
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

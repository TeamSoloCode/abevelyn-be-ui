import React, { memo, useCallback, useContext } from "react";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl";
import Modal from "react-bootstrap/Modal";
import { SubmitHandler, useForm } from "react-hook-form";
import { FieldDate } from "../../components/FieldDate";
import { FieldNumber } from "../../components/FieldNumber";
import { FieldSelect, Option } from "../../components/FieldSelect";
import { SingleValue } from "react-select";
import SaleContext from "../../context/sale.context";
import { ICreateSaleDto } from "../../dto/sales/create-sale.dto";
import moment from "moment";

interface ICreateMaterial {}

export const CreateSale = memo((props: ICreateMaterial) => {
  const saleContext = useContext(SaleContext);
  const state = saleContext?.state;
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<ICreateSaleDto>();
  const onSubmit: SubmitHandler<ICreateSaleDto> = useCallback(
    async ({ expiredDate, startedDate, unit, saleOff, maxOff }) => {
      const isSuccess = await saleContext?.createSale({ expiredDate, startedDate, unit, saleOff, maxOff });
      isSuccess && reset();
    },
    [saleContext?.createSale]
  );

  const onChangeSaleUnit = useCallback(
    (newOption: SingleValue<Option>) => {
      newOption?.value && setValue("unit", newOption?.value, {});
    },
    [setValue]
  );

  const onNumberChange = useCallback((value: string | undefined, name: keyof ICreateSaleDto) => {
    setValue(name, value ? Number(value) : 0);
  }, []);

  const setDefaultFieldEffect = (defaulValue: any, name: keyof ICreateSaleDto): any => {
    setValue(name, defaulValue);
    return defaulValue;
  };

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

  return (
    <Modal.Dialog className="w-100">
      <Modal.Header closeButton>
        <Modal.Title>Create New Material</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row className="align-items-center">
            <Col xs="auto">
              <FieldSelect
                label="Unit"
                placeholder="Select Unit"
                defaultValue={"%"}
                options={[
                  { value: "%", label: "Percentage (%)" },
                  { value: "usd", label: "USD" },
                ]}
                onChange={onChangeSaleUnit}
              />
              <FieldNumber label="Sale" name="saleOff" placeholder="Sale" onValueChange={onNumberChange} />

              <FieldNumber
                label="Max Off"
                name="maxOff"
                placeholder="Max Off"
                unit="USD"
                onValueChange={onNumberChange}
              />
              <hr />
              <FieldDate
                label="Start Date"
                name="startDate"
                onValueChange={onStartDateChange}
                showTimeInput
                timeInputLabel="Time:"
                dateFormat="MM/dd/yyyy h:mm aa"
                minDate={new Date()}
              />
              <FieldDate
                label="Expired Date"
                name="expiredDate"
                onValueChange={onExpDateChange}
                showTimeInput
                timeInputLabel="Time:"
                dateFormat="MM/dd/yyyy h:mm aa"
                minDate={getValues().startedDate || new Date()}
              />
              <Button type="submit" className="mb-2">
                Submit
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
    </Modal.Dialog>
  );
});

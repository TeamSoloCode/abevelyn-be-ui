import React, { memo, useCallback, useState, useRef, forwardRef, useMemo } from "react";
import AsyncSelect from "react-select/async";
import InputGroup from "react-bootstrap/InputGroup";
import DatePicker from "react-datepicker";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

interface IFieldDate {
  label: string;
  placeholder?: string;
  defaultValue?: Date;
  flexColumns?: [number, number];
  timeInputLabel?: string;
  dateFormat?: string;
  name: string;
  selectedDate?: Date;
  showTimeInput?: boolean;
  withPortal?: boolean;
  minDate?: Date;
  onValueChange?: (
    date: Date | [Date | null, Date | null] | null,
    event: React.SyntheticEvent<any, Event> | undefined
  ) => void;
  onSelect?: (date: Date, event: React.SyntheticEvent<any, Event> | undefined) => void;
}

export const FieldDate = memo((props: IFieldDate) => {
  const [date, setDate] = useState<Date | undefined>(props.selectedDate);

  const selectedDate = useMemo(() => {
    if (!date) {
      return props.defaultValue;
    }
    return date;
  }, [props.defaultValue, date]);

  const onValueChange = useCallback(
    (date: Date | [Date | null, Date | null] | null, event: React.SyntheticEvent<any, Event> | undefined) => {
      props?.onValueChange?.(date, event);
      date instanceof Date && setDate(date);
    },
    [props.onValueChange]
  );

  const onSelectDate = useCallback(
    (date: Date, event: React.SyntheticEvent<any, Event> | undefined) => {
      props?.onSelect?.(date, event);
    },
    [props.onSelect]
  );

  return (
    <InputGroup className="mb-2">
      <Col xs={`${props.flexColumns?.[0] || 2}`}>
        <InputGroup.Text>{props.label}</InputGroup.Text>
      </Col>
      <Col xs={`${props.flexColumns?.[1] || 10}`}>
        <DatePicker
          key={`${props.name}_${props.defaultValue}`}
          className="form-control"
          selected={selectedDate}
          onChange={onValueChange}
          onSelect={onSelectDate}
          placeholderText={props.placeholder}
          timeInputLabel={props.timeInputLabel}
          dateFormat={props.dateFormat}
          showTimeInput={props.showTimeInput}
          minDate={props.minDate}
          withPortal={props.withPortal}
        />
      </Col>
    </InputGroup>
  );
});

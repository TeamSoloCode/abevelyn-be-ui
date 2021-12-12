import React, { FunctionComponent, ReactElement, useCallback, useContext, useEffect, useMemo, useState } from "react";
import Table from "react-bootstrap/Table";
import { Product } from "../models/product.model";
import { RootModel } from "../models/root.model";

export interface IColumn<T> {
  headerTitle: string;
  item: (item: T) => any;
  headerComponent?: (headerTitle: string) => ReactElement;
  rowComponent?: (item: T) => ReactElement;
  isHidden?: boolean;
}

export interface IDataTable<T> {
  data: T[];
  columns: IColumn<T>[];
  onRowClick?: (item: T) => void;
}

export const TSCTable = React.memo(<T extends object>(props: IDataTable<any>) => {
  const onClick = useCallback(
    (e) => {
      const item = props.data.find((item) => item.uuid == e.currentTarget.dataset?.id);
      if (!item) return;
      props.onRowClick?.(item);
    },
    [props.data, props.onRowClick]
  );

  const tableHeader = useMemo(() => {
    return props.columns.map(({ headerTitle, headerComponent, isHidden }) => {
      if (isHidden) return null;
      if (headerComponent) {
        return <th key={headerTitle}>{headerComponent(headerTitle)}</th>;
      }
      return <th key={headerTitle}>{headerTitle}</th>;
    });
  }, [props.columns]);

  const tableBody = useMemo(() => {
    const listData = props.data;
    const columns = props.columns;
    return listData.map((data) => {
      const tds = columns.map(({ item, rowComponent, isHidden }, index) => {
        if (isHidden) return null;
        if (rowComponent) {
          return <td key={index}>{rowComponent(data)}</td>;
        }
        return <td key={index}>{item(data)}</td>;
      });

      return (
        <tr data-id={data.uuid} key={data.uuid} onClick={onClick}>
          {tds}
        </tr>
      );
    });
  }, [props.data, props.columns, props.onRowClick]);

  return (
    <Table striped bordered hover>
      <thead>
        <tr>{tableHeader}</tr>
      </thead>
      <tbody>{tableBody}</tbody>
    </Table>
  );
});

import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import moment from "moment";
import { AppRoutes, DEFAULT_DATETIME_FORMAT, SaleType } from "../../constanst";
import { IColumn, TSCTable } from "../../components/TSCTable";
import { UpdateSale } from "./update-sale";
import SaleContext from "../../context/sale.context";
import { Sale } from "../../models/sale.model";

export const SalePage = React.memo(() => {
  const saleContext = useContext(SaleContext);
  const state = saleContext?.state;
  const sales = state?.sales;

  const [showUpdateModal, setShowUpdateModel] = useState(false);
  let [selectedId, setSelectdId] = useState<string | undefined>(undefined);

  useEffect(() => {
    saleContext?.loadSales();
  }, []);

  const openUpdateModal = useCallback(() => {
    setShowUpdateModel(true);
  }, [setShowUpdateModel]);

  const closeUpdateModal = useCallback(() => {
    setShowUpdateModel(false);
  }, [setShowUpdateModel]);

  const onClickRow = useCallback(
    (sale: Sale) => {
      setSelectdId(sale.uuid);
      openUpdateModal();
    },
    [openUpdateModal, setSelectdId, selectedId]
  );

  const columns = useMemo(() => {
    return defaultColumns;
  }, []);

  return (
    <div>
      <Col xs="auto">
        <a className="btn" href={`/${AppRoutes.CREATE_SALE}`}>
          <Button className="mt-1">+ New Sale</Button>
        </a>
      </Col>
      <TSCTable data={sales || []} columns={columns} onRowClick={onClickRow} />
      {selectedId && <UpdateSale saleId={selectedId} show={showUpdateModal} close={closeUpdateModal} />}
    </div>
  );
});

const defaultColumns: IColumn<Sale>[] = [
  {
    headerTitle: "Name",
    item: (item) => item.name,
  },
  {
    headerTitle: "Description",
    item: (item) => item.description,
  },
  {
    headerTitle: "Type",
    item: (item) => {
      switch (item.saleType) {
        case SaleType.COLLECTION:
          return "For Collection";
        case SaleType.PRODUCT:
          return "For Production";
        case SaleType.ORDER:
          return "For Order";
      }
    },
  },
  {
    headerTitle: "Sale",
    item: (item) => item.saleOff,
  },
  {
    headerTitle: "Sale Unit",
    item: (item) => item.unit?.toLocaleUpperCase(),
  },
  {
    headerTitle: "Apply Price (USD)",
    item: (item) => item.applyPrice,
  },
  {
    headerTitle: "Max (USD)",
    item: (item) => item.maxOff,
  },
  {
    headerTitle: "Start Date",
    item: (item) => moment(item.startedDate).format(DEFAULT_DATETIME_FORMAT),
  },
  {
    headerTitle: "Expired Date",
    item: (item) => moment(item.expiredDate).format(DEFAULT_DATETIME_FORMAT),
  },
  {
    headerTitle: "Create At",
    item: (item) => moment(item.createdAt).format(DEFAULT_DATETIME_FORMAT),
  },
];

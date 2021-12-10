import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import Table from "react-bootstrap/Table";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

import ProductStatusContext from "../../context/product-status.context";
import { CreateProductStatus } from "./create-product-status";
import { UpdateProductStatus } from "./update-product-status";
import { AppRoutes } from "../../constanst";

const tableData = [
  ["Name", "name"],
  ["Name in French", "nameInFrench"],
  ["Name in Vietnamese", "nameInVietnames"],
  ["Create At", "createdAt"],
  ["Update At", "updatedAt"],
];

export const ProductStatusPage = React.memo(() => {
  const productStatusContext = useContext(ProductStatusContext);
  const state = productStatusContext?.state;
  const productStatus = state?.productStatus;

  const [showUpdateModal, setShowUpdateModel] = useState(false);
  let [selectedId, setSelectdId] = useState<string | undefined>(undefined);

  useEffect(() => {
    productStatusContext?.loadProductStatus();
  }, []);

  const openUpdateModal = useCallback(() => {
    setShowUpdateModel(true);
  }, [setShowUpdateModel]);

  const closeUpdateModal = useCallback(() => {
    setShowUpdateModel(false);
  }, [setShowUpdateModel]);

  const onClickRow = useCallback(
    (e) => {
      setSelectdId(e.currentTarget.dataset?.id);
      openUpdateModal();
    },
    [openUpdateModal, setSelectdId, selectedId]
  );

  const tableHeader = useMemo(() => {
    return tableData.map(([key, _]) => {
      return <th key={key}>{key}</th>;
    });
  }, [productStatus]);

  const tableBody = useMemo(() => {
    if (!productStatus) return null;
    return productStatus.map((status) => {
      const tds = tableData.map(([_, value], index) => {
        return <td key={index}>{status[value]}</td>;
      });
      return (
        <tr data-id={status.uuid} key={status.uuid} onClick={onClickRow}>
          {tds}
        </tr>
      );
    });
  }, [productStatus]);

  return (
    <div>
      <Col xs="auto">
        <a className="btn" href={`/${AppRoutes.CREATE_PRODUCT_STATUS}`}>
          <Button className="mt-1">+ New Product Status</Button>
        </a>
      </Col>
      <Table striped bordered hover>
        <thead>
          <tr>{tableHeader}</tr>
        </thead>
        <tbody>{tableBody}</tbody>
      </Table>
      {selectedId && <UpdateProductStatus statusId={selectedId} show={showUpdateModal} close={closeUpdateModal} />}
    </div>
  );
});

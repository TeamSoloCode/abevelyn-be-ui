import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import Table from "react-bootstrap/Table";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

import ProductStatusContext from "../context/product-status.context";
import { CreateProductStatus } from "../modals/create-product-status";
import { UpdateProductStatus } from "../modals/update-product-status";

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

  const [showCreateModal, setShowCreateModel] = useState(false);
  const [showUpdateModal, setShowUpdateModel] = useState(false);
  let [selectedId, setSelectdId] = useState<string | undefined>(undefined);

  useEffect(() => {
    productStatusContext?.loadProductStatus();
  }, []);

  const openCreateModal = useCallback(() => {
    setShowCreateModel(true);
  }, [setShowCreateModel]);

  const closeCreateModal = useCallback(() => {
    setShowCreateModel(false);
  }, [setShowCreateModel]);

  const openUpdateModal = useCallback(() => {
    setShowUpdateModel(true);
  }, [setShowCreateModel]);

  const closeUpdateModal = useCallback(() => {
    setShowUpdateModel(false);
  }, [setShowCreateModel]);

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
        <Button className="mb-2" onClick={openCreateModal}>
          + New Product Status
        </Button>
      </Col>
      <Table striped bordered hover>
        <thead>
          <tr>{tableHeader}</tr>
        </thead>
        <tbody>{tableBody}</tbody>
      </Table>
      <CreateProductStatus show={showCreateModal} close={closeCreateModal} />
      {selectedId && <UpdateProductStatus statusId={selectedId} show={showUpdateModal} close={closeUpdateModal} />}
    </div>
  );
});

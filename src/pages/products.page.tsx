import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import Table from "react-bootstrap/Table";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import ProductContext from "../context/product.context";

const tableData = [
  ["Name", "name"],
  ["Name in French", "nameInFrench"],
  ["Name in Vietnamese", "nameInVietnames"],
  ["Description", "description"],
  ["Description in French", "descriptionInFrench"],
  ["Description in Vietnamese", "descriptionInVietnames"],
  ["Status", "available", "_available"],
  ["Create At", "createdAt"],
  ["Update At", "updatedAt"],
];

export const ProductsPage = React.memo(() => {
  const productContext = useContext(ProductContext);
  const products = productContext?.state?.products;
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  let [selectedId, setSelectdId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!productContext?.loadProduct) return;
    productContext.loadProduct();
  }, []);

  const openCreateModal = useCallback(() => {
    setShowCreateModal(true);
  }, [setShowCreateModal]);

  const closeCreateModal = useCallback(() => {
    setShowCreateModal(false);
  }, [setShowCreateModal]);

  const openUpdateModal = useCallback(() => {
    setShowUpdateModal(true);
  }, [setShowCreateModal]);

  const closeUpdateModal = useCallback(() => {
    setShowUpdateModal(false);
  }, [setShowCreateModal]);

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
  }, [products]);

  const tableBody = useMemo(() => {
    if (!products) return null;
    return products.map((product) => {
      const tds = tableData.map(([_, value, type], index) => {
        if (type == "_available") {
          return <td key={index}>{product[value] ? "Available" : "Not Available"}</td>;
        }
        return <td key={index}>{product[value]}</td>;
      });
      return (
        <>
          <tr data-id={product.uuid} key={product.uuid} onClick={onClickRow}>
            {tds}
          </tr>
          {/* <div>ádasdasd</div> */}
        </>
      );
    });
  }, [products]);

  return (
    <div>
      <Col xs="auto">
        <Button className="mb-2" onClick={openCreateModal}>
          + New Product
        </Button>
      </Col>
      <Table striped bordered hover>
        <thead>
          <tr>{tableHeader}</tr>
        </thead>
        <tbody>{tableBody}</tbody>
      </Table>
      {/* <CreateCollection show={showCreateModal} close={closeCreateModal} />
      {selectedId && <UpdateCollection collectionId={selectedId} show={showUpdateModal} close={closeUpdateModal} />} */}
    </div>
  );
});

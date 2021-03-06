import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import Table from "react-bootstrap/Table";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import SizeContext from "../../context/size.context";
import { CreateSize } from "./create-size";
import { UpdateSize } from "./update-size";
import { AppRoutes } from "../../constanst";

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

export const SizePage = React.memo(() => {
  const sizeContext = useContext(SizeContext);
  const state = sizeContext?.state;
  const sizes = state?.sizes;

  const [showUpdateModal, setShowUpdateModel] = useState(false);
  let [selectedId, setSelectdId] = useState<string | undefined>(undefined);

  useEffect(() => {
    sizeContext?.loadSizes();
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
  }, [sizes]);

  const tableBody = useMemo(() => {
    if (!sizes) return null;
    return sizes.map((size) => {
      const tds = tableData.map(([_, value, type], index) => {
        if (type == "_available") {
          return <td key={index}>{size[value] ? "Available" : "Not Available"}</td>;
        }
        return <td key={index}>{size[value]}</td>;
      });
      return (
        <tr data-id={size.uuid} key={size.uuid} onClick={onClickRow}>
          {tds}
        </tr>
      );
    });
  }, [sizes]);

  return (
    <div>
      <Col xs="auto">
        <a className="btn" href={`/${AppRoutes.CREATE_SIZE}`}>
          <Button className="mt-1">+ New Size</Button>
        </a>
      </Col>
      <Table striped bordered hover>
        <thead>
          <tr>{tableHeader}</tr>
        </thead>
        <tbody>{tableBody}</tbody>
      </Table>
      {selectedId && <UpdateSize statusId={selectedId} show={showUpdateModal} close={closeUpdateModal} />}
    </div>
  );
});

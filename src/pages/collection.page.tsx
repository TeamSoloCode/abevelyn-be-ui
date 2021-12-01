import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import CollectionContext, { CollectionContextProvider } from "../context/collection.context";
import Table from "react-bootstrap/Table";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { CreateCollection } from "../components/create-collection";
import { UpdateCollection } from "../components/update-collection";

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

export const CollectionPage = React.memo(() => {
  const collectionContext = useContext(CollectionContext);
  const { collections } = collectionContext.state;
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  let [selectedId, setSelectdId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!collectionContext?.loadCollection) return;
    collectionContext.loadCollection();
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
  }, [collections]);

  const tableBody = useMemo(() => {
    if (!collections) return null;
    return collections.map((collection) => {
      const tds = tableData.map(([_, value, type], index) => {
        if (type == "_available") {
          return <td key={index}>{collection[value] ? "Available" : "Not Available"}</td>;
        }
        return <td key={index}>{collection[value]}</td>;
      });
      return (
        <tr data-id={collection.uuid} key={collection.uuid} onClick={onClickRow}>
          {tds}
        </tr>
      );
    });
  }, [collections]);

  return (
    <div>
      <Col xs="auto">
        <Button className="mb-2" onClick={openCreateModal}>
          + New Collection
        </Button>
      </Col>
      <Table striped bordered hover>
        <thead>
          <tr>{tableHeader}</tr>
        </thead>
        <tbody>{tableBody}</tbody>
      </Table>
      <CreateCollection show={showCreateModal} close={closeCreateModal} />
      {selectedId && <UpdateCollection collectionId={selectedId} show={showUpdateModal} close={closeUpdateModal} />}
    </div>
  );
});

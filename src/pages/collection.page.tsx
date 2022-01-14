import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import CollectionContext, { CollectionContextProvider } from "../context/collection.context";
import Table from "react-bootstrap/Table";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import get from "lodash.get";
import { CreateCollection } from "../modals/create-collection";
import { UpdateCollection } from "../modals/update-collection";
import { IColumn, TSCTable } from "../components/TSCTable";
import { Collection } from "../models/collection.model";
import moment from "moment";
import { DEFAULT_DATETIME_FORMAT } from "../constanst";
import ListGroup from "react-bootstrap/ListGroup";

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

  const columns = useMemo(() => {
    return defaultColumns;
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
    (collection: Collection) => {
      setSelectdId(collection.uuid);
      openUpdateModal();
    },
    [openUpdateModal, setSelectdId, selectedId]
  );

  return (
    <div>
      <Col xs="auto">
        <Button className="mb-2" onClick={openCreateModal}>
          + New Collection
        </Button>
      </Col>
      <TSCTable data={collections || []} columns={columns} onRowClick={onClickRow} />
      <CreateCollection show={showCreateModal} close={closeCreateModal} />
      {selectedId && <UpdateCollection collectionId={selectedId} show={showUpdateModal} close={closeUpdateModal} />}
    </div>
  );
});

const defaultColumns: IColumn<Collection>[] = [
  {
    headerTitle: "Name",
    item: (item) => item.name,
  },
  {
    headerTitle: "Name in French",
    item: (item) => item.nameInFrench,
  },
  {
    headerTitle: "Name in Vietnamese",
    item: (item) => item.nameInVietnames,
  },
  {
    headerTitle: "Description",
    item: (item) => item.description,
  },
  {
    headerTitle: "Description in French",
    item: (item) => item.descriptionInFrench,
  },
  {
    headerTitle: "Description in Vietnamese",
    item: (item) => item.descriptionInVietnames,
  },
  {
    headerTitle: "Sales",
    item: (item) => {
      return (
        <div key={item.uuid}>
          <ListGroup as="ol" numbered style={{ maxWidth: 200 }}>
            {(item?.sales || []).map((sale) => {
              return (
                <ListGroup.Item as="li" key={sale.uuid}>
                  {sale.name} ({sale.saleOff} {sale.unit})
                  <div>Start: {moment(sale.startedDate).format(DEFAULT_DATETIME_FORMAT)}</div>
                  <div>Expire: {moment(sale.expiredDate).format(DEFAULT_DATETIME_FORMAT)}</div>
                </ListGroup.Item>
              );
            })}
          </ListGroup>
        </div>
      );
    },
  },
  {
    headerTitle: "",
    item: (item) => (
      <div className="d-flex align-items-center justify-content-center">
        {item.available ? (
          <div className="btn btn-success">Available</div>
        ) : (
          <div className="btn btn-danger">Not Available</div>
        )}
      </div>
    ),
  },
  {
    headerTitle: "Create At",
    item: (item) => moment(item.createdAt).format(DEFAULT_DATETIME_FORMAT),
  },
];

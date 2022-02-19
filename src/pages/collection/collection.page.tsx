import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import CollectionContext, { CollectionContextProvider } from "../../context/collection.context";
import Table from "react-bootstrap/Table";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import get from "lodash.get";
import { CreateCollection } from "./create-collection";
import { IColumn, TSCTable } from "../../components/TSCTable";
import { Collection } from "../../models/collection.model";
import moment from "moment";
import { AppRoutes, DEFAULT_DATETIME_FORMAT } from "../../constanst";
import ListGroup from "react-bootstrap/ListGroup";
import { ClientApi, clientApi } from "../../client-api/api.client";
import { Route, Routes, useNavigate } from "react-router";
import { Link } from "react-router-dom";

export const CollectionPage = React.memo(() => {
  const collectionContext = useContext(CollectionContext);
  const { collections } = collectionContext.state;
  const navigate = useNavigate();

  useEffect(() => {
    if (!collectionContext?.loadCollection) return;
    collectionContext.loadCollection();
  }, []);

  const columns = useMemo(() => {
    return defaultColumns;
  }, []);

  const onClickRow = useCallback(
    (item: Collection) => {
      navigate(`/${AppRoutes.UPDATE_COLLECTION}/${item.uuid}`);
    },
    [navigate]
  );

  return (
    <div>
      <Col xs="auto">
        <Link className="btn" to={AppRoutes.CREATE_COLLECTION}>
          <Button className="mt-1">+ New Collection</Button>
        </Link>
      </Col>
      <Routes>
        <Route path={AppRoutes.CREATE_COLLECTION} element={<CreateCollection />} />
      </Routes>
      <TSCTable data={collections || []} columns={columns} onRowClick={onClickRow} />
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
    headerTitle: "Image",
    item: (item) => (
      <div className="rounded overflow-hidden" style={{ width: 150, height: 100 }}>
        <img
          width={"100%"}
          height={"100%"}
          src={clientApi.getImageURLByName(ClientApi.APIs.FETCH_IMAGE, item?.image || "")}
        />
      </div>
    ),
  },
  {
    headerTitle: "Create At",
    item: (item) => moment(item.createdAt).format(DEFAULT_DATETIME_FORMAT),
  },
];

import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import Table from "react-bootstrap/Table";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import ProductContext from "../../context/product.context";
import { CreateProduct } from "./create-product";
import { AppRoutes, DEFAULT_DATETIME_FORMAT } from "../../constanst";
import { TSCTable, IColumn } from "../../components/TSCTable";
import { Product } from "../../models/product.model";
import { BrowserRouter as Router, Routes, Route, Link, Outlet, useNavigate } from "react-router-dom";
import { clientApi, ClientApi } from "../../client-api/api.client";
import map from "lodash.map";
import numeral from "numeral";
import moment from "moment";
import { getImageUrl } from "../../utils";

export const ProductsPage = React.memo(() => {
  const productContext = useContext(ProductContext);
  const products = productContext?.state?.products;
  const navigate = useNavigate();

  const onRowClick = useCallback(
    (item: Product) => {
      navigate(`/${AppRoutes.UPDATE_PRODUCT}/${item.uuid}`);
    },
    [navigate]
  );

  const columns = useMemo(() => {
    return defaultColumns;
  }, []);

  useEffect(() => {
    if (!productContext?.loadProduct) return;
    productContext.loadProduct();
  }, []);

  return (
    <div>
      <Col xs="auto">
        <Link className="btn" to={AppRoutes.CREATE_PRODUCT}>
          <Button className="mt-1">+ New Product</Button>
        </Link>
      </Col>
      {/* <Outlet /> */}
      <Routes>
        <Route path={AppRoutes.CREATE_PRODUCT} element={<CreateProduct />} />
      </Routes>
      <h2>Products</h2>
      <hr />
      <TSCTable data={products || []} columns={columns} onRowClick={onRowClick} />
    </div>
  );
});

const defaultColumns: IColumn<Product>[] = [
  {
    headerTitle: "Name",
    item: (item) => item.name,
  },
  {
    headerTitle: "Quantity",
    item: (item) => item.quantity,
  },
  {
    headerTitle: "Price",
    item: (item) => numeral(item.price).format("$0,0.00"),
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
    headerTitle: "Color",
    item: (item) => (
      <div className="d-flex align-items-center justify-content-center">
        <div
          title={item.color.name}
          style={{ width: 16, height: 16, borderRadius: 32, backgroundColor: item.color.code }}
        />
      </div>
    ),
  },
  {
    headerTitle: "Status",
    item: (item) => item.productStatus.name,
  },
  {
    headerTitle: "Size",
    item: (item) => item.size.name,
  },
  {
    headerTitle: "Collections",
    item: (item) => {
      return (
        <div key={item.uuid}>
          <ListGroup as="ol" numbered>
            {map(item.collections, "name").map((name) => {
              return (
                <ListGroup.Item as="li" key={name}>
                  {name}
                </ListGroup.Item>
              );
            })}
          </ListGroup>
        </div>
      );
    },
  },
  {
    headerTitle: "Materials",
    item: (item) => {
      return (
        <div key={item.uuid}>
          <ListGroup as="ol" numbered>
            {map(item.materials, "name").map((name) => {
              return (
                <ListGroup.Item as="li" key={name}>
                  {name}
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
        <img width={"100%"} height={"100%"} src={getImageUrl(item.image)} />
      </div>
    ),
  },
  {
    headerTitle: "Create At",
    item: (item) => moment(item.createdAt).format(DEFAULT_DATETIME_FORMAT),
  },
];

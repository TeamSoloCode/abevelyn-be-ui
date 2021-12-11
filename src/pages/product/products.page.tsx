import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import Table from "react-bootstrap/Table";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import ProductContext from "../../context/product.context";
import { CreateProduct } from "./create-product";
import { AppRoutes } from "../../constanst";
import { TSCTable, IColumn } from "../../components/TSCTable";
import { Product } from "../../models/product.model";

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

const columns: IColumn<Product>[] = [
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
    item: (item) => item.nameInVietnamese,
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
    item: (item) => item.descriptionInVietnamese,
  },
  {
    headerTitle: "Status",
    item: (item) => (item.available ? "Available" : "Not Available"),
  },
  {
    headerTitle: "Create At",
    item: (item) => item.createdAt,
  },
  {
    headerTitle: "Update At",
    item: (item) => item.updatedAt,
  },
];

export const ProductsPage = React.memo(() => {
  const productContext = useContext(ProductContext);
  const products = productContext?.state?.products;

  const onRowClick = useCallback((item: Product) => {
    alert(item.name);
  }, []);

  useEffect(() => {
    if (!productContext?.loadProduct) return;
    productContext.loadProduct();
  }, []);

  return (
    <div>
      <Col xs="auto">
        <a className="btn" href={`/${AppRoutes.CREATE_PRODUCT}`}>
          <Button className="mt-1">+ New Product</Button>
        </a>
      </Col>
      <TSCTable data={products || []} columns={columns} onRowClick={onRowClick} />
    </div>
  );
});

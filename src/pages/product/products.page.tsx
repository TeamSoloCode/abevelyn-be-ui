import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import Table from "react-bootstrap/Table";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import ProductContext from "../../context/product.context";
import { CreateProduct } from "./create-product";
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

export const ProductsPage = React.memo(() => {
  const productContext = useContext(ProductContext);
  const products = productContext?.state?.products;
  let [selectedId, setSelectdId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!productContext?.loadProduct) return;
    productContext.loadProduct();
  }, []);

  const onClickRow = useCallback(
    (e) => {
      setSelectdId(e.currentTarget.dataset?.id);
      // useNavigate()
    },
    [setSelectdId, selectedId]
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
        <tr data-id={product.uuid} key={product.uuid} onClick={onClickRow}>
          {tds}
        </tr>
      );
    });
  }, [products]);

  return (
    <div>
      <Col xs="auto">
        <a className="btn" href={`/${AppRoutes.CREATE_PRODUCT}`}>
          <Button className="mt-1">+ New Product</Button>
        </a>
      </Col>
      <Table striped bordered hover>
        <thead>
          <tr>{tableHeader}</tr>
        </thead>
        <tbody>{tableBody}</tbody>
      </Table>
    </div>
  );
});

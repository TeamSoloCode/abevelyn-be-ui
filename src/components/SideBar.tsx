import React, { memo, useCallback, useMemo } from "react";
import NavDropdown from "react-bootstrap/NavDropdown";
import Accordion from "react-bootstrap/Accordion";
import { AppRoutes } from "../constanst";
import { useLocation } from "react-router-dom";
import { ClientApi } from "../client-api/api.client";

export const SideBar = memo(() => {
  const location = useLocation();

  const activeKey = useMemo<string>(() => {
    const rootPath = location.pathname.split("/")[1];
    switch (rootPath) {
      case AppRoutes.PRODUCTS:
      case AppRoutes.COLLECTIONS:
      case AppRoutes.COLORS:
      case AppRoutes.SIZES:
      case AppRoutes.PRODUCT_STATUS:
      case AppRoutes.MATERIAL:
      case AppRoutes.SALE:
        return AppRoutes.PRODUCTS;
      case AppRoutes.ORDER:
        return "orders";
      case AppRoutes.USERS:
        return "accounts";
      default:
        return AppRoutes.HOME;
    }
  }, [location.pathname]);

  return (
    <div className="sidebar">
      <Accordion defaultActiveKey={activeKey}>
        <Accordion.Item eventKey="home">
          <Accordion.Header>Home</Accordion.Header>
          <Accordion.Body>
            <NavDropdown.Item href={`/`}>Home</NavDropdown.Item>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="products">
          <Accordion.Header>Product</Accordion.Header>
          <Accordion.Body>
            <NavDropdown.Item href={`/${AppRoutes.PRODUCTS}`}>Products</NavDropdown.Item>
            <NavDropdown.Item href={`/${AppRoutes.COLLECTIONS}`}>Collection</NavDropdown.Item>
            <NavDropdown.Item href={`/${AppRoutes.COLORS}`}>Colors</NavDropdown.Item>
            <NavDropdown.Item href={`/${AppRoutes.SIZES}`}>Sizes</NavDropdown.Item>
            <NavDropdown.Item href={`/${AppRoutes.PRODUCT_STATUS}`}>Product Status</NavDropdown.Item>
            <NavDropdown.Item href={`/${AppRoutes.MATERIAL}`}>Materials</NavDropdown.Item>
            <NavDropdown.Item href={`/${AppRoutes.SALE}`}>Sales</NavDropdown.Item>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="orders">
          <Accordion.Header>Order</Accordion.Header>
          <Accordion.Body>
            <NavDropdown.Item href={`/${AppRoutes.ORDER}`}>Orders</NavDropdown.Item>
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="accounts">
          <Accordion.Header>Account</Accordion.Header>
          <Accordion.Body>
            <NavDropdown.Item href={`/${AppRoutes.USERS}`}>Accounts</NavDropdown.Item>
            <NavDropdown.Item href="#address">Addresses</NavDropdown.Item>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
});

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
        return AppRoutes.PRODUCTS;
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
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="orders">
          <Accordion.Header>Order</Accordion.Header>
          <Accordion.Body>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
            ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
            nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum.
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
});

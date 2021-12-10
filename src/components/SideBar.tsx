import React, { memo, useCallback, useMemo } from "react";
import NavDropdown from "react-bootstrap/NavDropdown";
import Accordion from "react-bootstrap/Accordion";
import { AppRoutes } from "../constanst";
import { useLocation } from "react-router";

export const SideBar = memo(() => {
  const location = useLocation();

  const isActiveRoute = useCallback(
    (e): any => {
      console.log(e.target.value);
    },
    [location.pathname]
  );

  const dropdownTitle = useMemo((): string => {
    const routeNames = Object.values(AppRoutes);
    for (let route of routeNames) {
      if (location.pathname.includes(route)) {
        return route.charAt(0).toUpperCase() + route.substring(1, route.length);
      }
    }
    return "Home";
  }, [location.pathname]);

  return (
    <div className="sidebar">
      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header>Home</Accordion.Header>
          <Accordion.Body>
            <NavDropdown.Item href={`/`}>Home</NavDropdown.Item>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header>Product</Accordion.Header>
          <Accordion.Body>
            <NavDropdown.Item href={`/${AppRoutes.PRODUCTS}`}>Products</NavDropdown.Item>
            <NavDropdown.Item href={`/${AppRoutes.COLLECTIONS}`}>Collection</NavDropdown.Item>
            <NavDropdown.Item href={`/${AppRoutes.COLORS}`}>Colors</NavDropdown.Item>
            <NavDropdown.Item href={`/${AppRoutes.SIZES}`}>Sizes</NavDropdown.Item>
            <NavDropdown.Item href={`/${AppRoutes.PRODUCT_STATUS}`}>Product Status</NavDropdown.Item>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="2">
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

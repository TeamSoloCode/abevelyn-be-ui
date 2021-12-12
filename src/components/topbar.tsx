import React, { memo, MouseEventHandler, useCallback, useMemo } from "react";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import { AppRoutes } from "../constanst";
import { useLocation } from "react-router-dom";

export const TopBar = memo(() => {
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
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="#home">Abevelyn Admin</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <NavDropdown title={dropdownTitle} id="collasible-nav-dropdown" onClick={isActiveRoute}>
              <NavDropdown.Item href={`/`}>Home</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href={`/${AppRoutes.PRODUCTS}`}>Products</NavDropdown.Item>
              <NavDropdown.Item href={`/${AppRoutes.COLLECTIONS}`}>Collection</NavDropdown.Item>
              <NavDropdown.Item href={`/${AppRoutes.COLORS}`}>Colors</NavDropdown.Item>
              <NavDropdown.Item href={`/${AppRoutes.SIZES}`}>Sizes</NavDropdown.Item>
              <NavDropdown.Item href={`/${AppRoutes.PRODUCT_STATUS}`}>Product Status</NavDropdown.Item>
              <NavDropdown.Divider />
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
});

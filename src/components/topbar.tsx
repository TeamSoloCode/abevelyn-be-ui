import React, { memo, MouseEventHandler, useCallback, useMemo } from "react";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import { AppRoutes } from "../constanst";
import { useLocation } from "react-router";

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
              <NavDropdown.Item href={`/${AppRoutes.PRODUCTS}`}>Products</NavDropdown.Item>
              <NavDropdown.Item href={`/${AppRoutes.COLLECTIONS}`}>Collection</NavDropdown.Item>
              <NavDropdown.Item href={`/${AppRoutes.COLORS}`}>Colors</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link href="#features">Features</Nav.Link>
            <Nav.Link href="#pricing">Pricing</Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link href="#deets">More deets</Nav.Link>
            <Nav.Link eventKey={2} href="#memes">
              Dank memes
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
});

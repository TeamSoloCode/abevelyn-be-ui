import React, { memo, MouseEventHandler, useCallback, useContext, useMemo } from "react";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { AppRoutes } from "../constanst";
import { useLocation } from "react-router-dom";
import AppContext from "../context/app.context";

export const TopBar = memo(() => {
  const location = useLocation();
  const appContext = useContext(AppContext);

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
    <div className="top-bar">
      <Row>
        <Navbar bg="dark" variant="dark">
          <Col xs="10">
            <Navbar.Brand href="#home">Abevelyn Admin</Navbar.Brand>
          </Col>
          <Col xs="2">
            <Button variant="secondary" size="lg" onClick={appContext.logout}>
              Logout
            </Button>
          </Col>
        </Navbar>
      </Row>
    </div>
  );
});

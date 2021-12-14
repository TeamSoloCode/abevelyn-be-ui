import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { SideBar } from "../components/SideBar";
import { TopBar } from "../components/TopBar";
import { routes } from "../routes";
import { BrowserRouter as Router, Routes, Route, Link, Outlet } from "react-router-dom";
import Container from "react-bootstrap/Container";

export const HomePage = React.memo(() => {
  return (
    <Container className="home" fluid>
      <Row>
        <Row>
          <TopBar />
        </Row>
        <Row className="h-100">
          <Col xs="2">
            <SideBar />
          </Col>
          <Col className="home__content" xs="10">
            <Outlet />
            <Routes>
              {routes.map((route) => (
                <Route key={route.path} {...route} />
              ))}
            </Routes>
          </Col>
        </Row>
      </Row>
    </Container>
  );
});

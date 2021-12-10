import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Outlet } from "react-router";
import { SideBar } from "../components/SideBar";
import { TopBar } from "../components/TopBar";

export const HomePage = React.memo(() => {
  return (
    <Row className="home">
      <Row>
        <TopBar />
      </Row>
      <Row className="h-100">
        <Col xs="3">
          <SideBar />
        </Col>
        <Col className="home__content" xs="9">
          <Outlet />
        </Col>
      </Row>
    </Row>
  );
});

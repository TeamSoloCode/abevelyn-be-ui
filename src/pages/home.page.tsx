import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { SideBar } from "../components/SideBar";
import { TopBar } from "../components/TopBar";
import { routes } from "../routes";
import { BrowserRouter as Router, Routes, Route, Link, Outlet } from "react-router-dom";

export const HomePage = React.memo(() => {
  return (
    <Row className="home">
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
  );
});

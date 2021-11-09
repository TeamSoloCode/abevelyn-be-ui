import React from "react";
import Nav from "react-bootstrap/Nav";
import { useLocation } from "react-router";
import { Link, Outlet } from "react-router-dom";
import { AppRoutes } from "./constanst";

export const App = (props) => {
  let location = useLocation();
  return (
    <div>
      <Nav fill variant="tabs" defaultActiveKey={`/${AppRoutes.HOME}`} activeKey={location.pathname}>
        <Nav.Item>
          <Nav.Link href={`/${AppRoutes.HOME}`}>Home</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href={`/${AppRoutes.COLLECTIONS}`}>Collection</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="link-2">Link</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="disabled" disabled>
            Disabled
          </Nav.Link>
        </Nav.Item>
      </Nav>
      <div>
        <Outlet />
      </div>
    </div>
  );
};

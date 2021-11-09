import React from "react";
import ReactDOM from "react-dom";
import "./sass/main.scss";
import { App } from "./App";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Home } from "./pages/home.page";
import { Collection } from "./pages/collection.page";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App ancd={123} />}>
          <Route path="home" element={<Home />} />
          <Route path="collection" element={<Collection />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

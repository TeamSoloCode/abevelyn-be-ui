import React from "react";
import ReactDOM from "react-dom";
import "./sass/main.scss";
import { App } from "./App";
import { BrowserRouter } from "react-router-dom";
import { AppContextProvider } from "./context/app.context";
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <AppContextProvider>
        <App />
      </AppContextProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

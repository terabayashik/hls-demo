import { App } from "./components/App";
import React from "react";
import ReactDOM from "react-dom";

const renderPage = async () => {
  const app = <App />;
  ReactDOM.render(app, document.getElementById("root"));
};

renderPage();

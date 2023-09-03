import React from "react";
import ReactDOM from "react-dom/client";
import { AppClient } from "./web/App.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppClient />
  </React.StrictMode>
);

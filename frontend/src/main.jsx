import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Welcome from "./Welcome";
import Profiles from "./Profiles";
import "./index.css";
import App from "./App";

ReactDOM.render(
  <Router>
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/profiles" element={<Profiles />} />
      <Route path="/app" element={<App />} />
    </Routes>
  </Router>,
  document.getElementById("root")
);

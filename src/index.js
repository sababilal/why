import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import WhyResult from "./WhyResult";
import { Switch, Route, Redirect } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle";

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route exact path="/whyquestionnaire" component={App}></Route>
      <Route path="/whyresult/:value" component={WhyResult}></Route>
      <Redirect to="whyquestionnaire" />
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);

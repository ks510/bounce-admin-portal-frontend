import React, { Component } from "react";
import LinkButton from "../components/LinkButton";
import "./ResetPasswordSuccess.css";

export default class ResetPasswordSuccess extends Component {

  render() {
    return (
      <div className="ResetPasswordSuccess">
        <h3>Password Successfully Reset.</h3>
        <LinkButton
          bsSize="large"
          text="Go to Management Portal"
          href="/" />
      </div>
    );
  }
}

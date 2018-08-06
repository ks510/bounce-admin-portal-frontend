import React, { Component } from "react";
import "./ForgotPassword.css";

export default class ForgotPassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      confirmationCode: "",
      isLoading: true
    };
  }

  render() {
    return (<p>Lets reset your Password</p>);
  }

  //TODO: render form for resetting password
  // Email field, confirmation code will be sent by email to start the procecs
  // change password by confirming with code and new password
}

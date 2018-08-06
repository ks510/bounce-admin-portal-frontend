import React, { Component } from "react";
import "./ForgotPassword.css";
import {
  HelpBlock,
  FormGroup,
  FormControl,
  ControlLabel
} from "react-bootstrap";
import { Auth } from "aws-amplify";
import LoaderButton from "../components/LoaderButton";

export default class ForgotPassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      confirmationCode: "",
      codeSent: false,
      isLoading: false
    };
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  /**
   * Request Cognito to send a verification code to user's email
   **/
  handleEmailSubmit = async event => {
    event.preventDefault();

    this.setState({ isLoading: true });

    try {
      await Auth.forgotPassword(this.state.email);
      this.setState({ codeSent: true });
    } catch (e) {
      alert(e.message);
      this.setState({ isLoading: false });
    }
  }

  /**
   * Ensures the email field cannot be empty.
   **/
  validateEmailForm() {
    return this.state.email.length > 0;
  }

  render() {
    return (
      <div className="ForgotPassword">
        {this.state.codeSent
          ? this.renderResetPasswordForm()
          : this.renderEmailForm()}
      </div>
    );
  }

  renderEmailForm2() {
    return (
      <p>Please enter the email of your account to reset your password.</p>
    );
  }

  renderResetPasswordForm() {
    return (
      <p>Please enter the confirmation code and your new password.</p>
    );
  }

  renderEmailForm() {
    return (
      <div className="EmailForgotPasswordForm">
        <form onSubmit={this.handleEmailSubmit}>
          <h3>Reset your password.</h3>
          <p>Please enter the email of your account to reset your password.
          You&#39;ll receive an email within a few minutes to with a code for
          resetting your account password. Please enter the code below.</p>
          <FormGroup controlId="email" bsSize="large">
            <ControlLabel>Email</ControlLabel>
            <FormControl
              autoFocus
              type="email"
              value={this.state.email}
              onChange={this.handleChange}
              placeholder="johnsmith@bouncebot.io"
            />
          </FormGroup>
          <LoaderButton
            block
            bsSize="large"
            disabled={!this.validateEmailForm()}
            type="submit"
            isLoading={this.state.isLoading}
            text="Send Code"
            loadingText="Sending Code..."
          />
        </form>
      </div>
    );
  }

  //TODO: render form for resetting password
  // Email field, confirmation code will be sent by email to start the procecs
  // change password by confirming with code and new password
}

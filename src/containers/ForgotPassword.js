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
      password: "",
      confirmPassword: "",
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
   * Request Cognito to confirm code and reset password to new one.
   **/
  handleResetPasswordSubmit = async event => {
    event.preventDefault();

    this.setState({ isLoading: true });


    try {
      await Auth.forgotPasswordSubmit(this.state.email,this.state.confirmationCode,this.state.password);
      await Auth.signIn(this.state.email, this.state.password);
      this.props.userHasAuthenticated(true);
      this.props.history.push("/");
    } catch (e) {
      alert(e.message);
    }
    this.setState({ isLoading: false });
  }

  handleEmailSubmit = async event => {
    event.preventDefault();

    this.setState({ isLoading: true });

    try {
      await Auth.forgotPassword(this.state.email);
      this.setState({ codeSent: true });
    } catch (e) {
      alert(e.message);
    }
    this.setState({ isLoading: false });
  }

  /**
   * Ensures the email field cannot be empty.
   **/
  validateEmailForm() {
    return this.state.email.length > 0;
  }

  validateResetPasswordForm() {
    return (
      this.state.confirmationCode.length > 0 &&
      this.state.password.length > 8 &&
      this.state.confirmPassword === this.state.password
    );
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

  renderResetPasswordForm() {
    return (
      <div className="ConfirmationForm">
        <form onSubmit={this.handleResetPasswordSubmit}>
          <h3>Verify your account.</h3>
          <p>Please enter the confirmation code and your new password.</p>
          <FormGroup controlId="confirmationCode" bsSize="large">
            <ControlLabel>Confirmation Code</ControlLabel>
            <FormControl
              autoFocus
              type="tel"
              value={this.state.confirmationCode}
              onChange={this.handleChange}
            />
            <HelpBlock>Please check your email for the code.</HelpBlock>
          </FormGroup>
          <FormGroup controlId="password" bsSize="large">
            <ControlLabel>Create your new password</ControlLabel>
            <FormControl
              value={this.state.password}
              onChange={this.handleChange}
              type="password"
              placeholder="Minimum 8 characters"
            />
          </FormGroup>
          <FormGroup controlId="confirmPassword" bsSize="large">
            <ControlLabel>Confirm your new password</ControlLabel>
            <FormControl
              value={this.state.confirmPassword}
              onChange={this.handleChange}
              type="password"
              placeholder="Retype your password"
            />
          </FormGroup>
          <LoaderButton
            block
            bsSize="large"
            disabled={!this.validateResetPasswordForm()}
            type="verify"
            isLoading={this.state.isLoading}
            text="Change Password"
            loadingText="Changing Password.."
          />
        </form>
      </div>
    );
  }

  renderEmailForm() {
    return (
      <div className="EmailForgotPasswordForm">
        <form onSubmit={this.handleEmailSubmit}>
          <h3>Reset your password.</h3>
          <p>Please enter the email of your account to reset your password.
          You&#39;ll receive an email within a few minutes to with a code for
          resetting your account password.</p>
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

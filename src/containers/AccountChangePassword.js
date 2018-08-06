import React, { Component } from "react";
import {
  HelpBlock,
  FormGroup,
  FormControl,
  ControlLabel
} from "react-bootstrap";
import { Auth } from "aws-amplify";
import LoaderButton from "../components/LoaderButton";

export default class AccountChangePassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
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
      this.props.history.push("/resetpasswordsuccess");
    } catch (e) {
      alert(e.message);
    }
    this.setState({ isLoading: false });
  }

  validateForm() {
    return (
      this.state.
      this.state.oldPassword.length > 8 &&
      this.state.newPassword.length > 8 &&
      this.state.confirmNewPassword === this.state.newPassword
    );
  }

  render() {
    return (
      <div className="ChangePasswordForm">
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
}

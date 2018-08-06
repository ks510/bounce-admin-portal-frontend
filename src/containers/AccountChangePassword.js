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
      const user = await Auth.currentAuthenticatedUser();
      await Auth.changePassword(user, this.state.oldPassword, this.state.newPassword);
      this.props.history.push("/resetpasswordsuccess");
    } catch (e) {
      alert(e.message);
    }
    this.setState({ isLoading: false });
  }

  validateResetPasswordForm() {
    return (
      this.state.oldPassword.length > 8 &&
      this.state.newPassword.length > 8 &&
      this.state.confirmNewPassword === this.state.newPassword
    );
  }

  render() {
    return (
      <div className="ChangePasswordForm">
        <form onSubmit={this.handleResetPasswordSubmit}>
          <h3>Change your password.</h3>
          <p>Please enter your current password to confirm you are the account
          owner and enter your new password below.</p>
          <FormGroup controlId="oldPassword" bsSize="large">
            <ControlLabel>Current password</ControlLabel>
            <FormControl
              value={this.state.oldPassword}
              onChange={this.handleChange}
              type="password"
            />
          </FormGroup>
          <FormGroup controlId="newPassword" bsSize="large">
            <ControlLabel>New password</ControlLabel>
            <FormControl
              value={this.state.newPassword}
              onChange={this.handleChange}
              type="password"
              placeholder="Minimum 8 characters"
            />
          </FormGroup>
          <FormGroup controlId="confirmNewPassword" bsSize="large">
            <ControlLabel>Confirm new password</ControlLabel>
            <FormControl
              value={this.state.confirmNewPassword}
              onChange={this.handleChange}
              type="password"
              placeholder="Retype your password"
            />
          </FormGroup>
          <LoaderButton
            block
            bsSize="large"
            disabled={!this.validateResetPasswordForm()}
            type="submit"
            isLoading={this.state.isLoading}
            text="Change Password"
            loadingText="Changing Password..."
          />
        </form>
      </div>
    );
  }
}

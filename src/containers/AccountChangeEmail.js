import React, { Component } from "react";
import {
  FormGroup,
  FormControl,
  ControlLabel
} from "react-bootstrap";
import { Auth } from "aws-amplify";
import LoaderButton from "../components/LoaderButton";


export default class AccountChangeEmail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentEmail: "",
      newEmail: "",
      isLoading: false
    };
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  /**
   * Retrieve user's current email from Cognito and verify with user's input.
   **/
  handleEmailUpdateSubmit = async event => {
    event.preventDefault();

    this.setState({ isLoading: true });

    try {
      const userInfo = await Auth.currentUserInfo();
      console.log(userInfo.attributes.email);
      if (this.confirmCurrentEmail(this.state.currentEmail, userInfo.attributes.email)) {
        const user = await Auth.currentAuthenticatedUser();
        await Auth.updateUserAttributes(user, {
          "email": this.state.newEmail
        });

        this.props.history.push("/");
      } else {
        alert("Incorrect email entered, please try again.");
      }
    } catch (e) {
      alert(e.message);
    }
    this.setState({ isLoading: false });
  }

  confirmCurrentEmail(inputEmail, userAccountEmail) {
    return inputEmail === userAccountEmail;
  }

  validateEmailUpdateForm() {
    return (
      this.state.currentEmail.length > 0 &&
      this.state.newEmail.length > 0
    );
  }

  render() {
    return (
      <div className="AccountChangeEmail">
        <form onSubmit={this.handleEmailUpdateSubmit}>
          <h3>Update your email.</h3>
          <p>Please confirm your current email and enter your new email below.</p>
          <FormGroup controlId="currentEmail" bsSize="large">
            <ControlLabel>Current Email</ControlLabel>
            <FormControl
              value={this.state.currentEmail}
              onChange={this.handleChange}
              type="email"
            />
          </FormGroup>
          <FormGroup controlId="newEmail" bsSize="large">
            <ControlLabel>New Email</ControlLabel>
            <FormControl
              value={this.state.newEmail}
              onChange={this.handleChange}
              type="email"
              placeholder=""
            />
          </FormGroup>
          <LoaderButton
            block
            bsSize="large"
            disabled={!this.validateEmailUpdateForm()}
            type="submit"
            isLoading={this.state.isLoading}
            text="Update Email"
            loadingText="Updating Email..."
          />
        </form>
      </div>
    );
  }
}
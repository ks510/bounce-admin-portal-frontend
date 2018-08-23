import React, { Component } from "react";
import {
  HelpBlock,
  FormGroup,
  FormControl,
  ControlLabel
} from "react-bootstrap";
import { Auth } from "aws-amplify";
import LoaderButton from "../components/LoaderButton";
import "./AccountChangeEmail.css";

/**
 * Renders form for changing account email. User must also verify their new email
 * by a code sent to their new email address.
 **/
export default class AccountChangeEmail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentEmail: "",
      newEmail: "",
      confirmationCode: "",
      codeSent: false,
      isLoading: false,
      resentCode: false,
      resendIsLoading: false
    };
  }

/**
  * Updates the state of form text fields.
  **/
  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

/**
  * Allows user to revisit change email page later and still be able to verify.
  **/
  async componentDidMount() {
    try {
      const userInfo = await Auth.currentUserInfo();
      const verified = userInfo.attributes.email_verified;
      console.log(`${userInfo.attributes.email} is ${verified}`);
      console.log("Email verified: " + verified);
      this.setState({ codeSent: !verified });
    }
    catch(e) {
      alert(e.message);
    }
  }

  /**
   * Retrieve user's current email from Cognito and verify with user's input.
   **/
  handleEmailUpdateSubmit = async event => {
    event.preventDefault();

    this.setState({ isLoading: true });

    try {
      const userInfo = await Auth.currentUserInfo();

      if (this.confirmCurrentEmail(this.state.currentEmail, userInfo.attributes.email)) {
        const user = await Auth.currentAuthenticatedUser();
        await Auth.updateUserAttributes(user, {
          "email": this.state.newEmail
        });
        this.setState({ codeSent: true });
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

  /**
   * Verify user's new email using the confirmation code provided. Redirects
   * user back to portal landing page on success.
   **/
  handleEmailConfirmation = async event => {
    event.preventDefault();

    this.setState({ isLoading: true });

    try {
      await Auth.verifyCurrentUserAttributeSubmit("email", this.state.confirmationCode);
      this.setState({ codeSent: false });
      this.props.history.push("/");
    } catch (e) {
      alert(e.message);
    }
    this.setState({ isLoading: false });
  }

  /**
   * Sends a new confirmation code to the user's new email for verificaiton.
   **/
  resendConfirmationCode = async event => {

    this.setState({ resendIsLoading: true });
    try {
      const userInfo = await Auth.currentUserInfo();
      const user = await Auth.currentAuthenticatedUser();
      // Auth doesn't have resend confirmation code method
      // Therefore, update user's email to a non-existent email and then update
      // again with their new email to trigger a new confirmation code email.
      await Auth.updateUserAttributes(user, {
        "email": "dummyplaceholder1234@bouncebot.io"
      });
      await Auth.updateUserAttributes(user, {
        "email": userInfo.attributes.email
      });

      this.setState({ resentCode: true });
    } catch (e) {
      alert(e.message);
    }

    this.setState({ resendIsLoading: false });

  }

  /**
   * Validates password fields of the form by checking if it is filled in.
   * Note the form control component handles checking for @ in the email fields.
   **/
  validateEmailUpdateForm() {
    return (
      this.state.currentEmail.length > 0 &&
      this.state.newEmail.length > 0
    );
  }

  /**
   * Validates confirmation code field by checking if it filled in.
   **/
  validateConfirmationForm() {
    return this.state.confirmationCode > 0;
  }

  render() {
    return (
      <div className="AccountChangeEmail">
      {this.state.codeSent
        ? this.renderConfirmationForm()
        : this.renderEmailUpdateForm() }
      </div>
    )
  }

  /**
   * Render form for updating account email.
   **/
  renderEmailUpdateForm() {
    return (
      <div className="EmailUpdateForm">
        <form onSubmit={this.handleEmailUpdateSubmit}>
          <h3>Update your email.</h3>
          <p>Please confirm your current email and enter your new email below.
          A confirmation code will be sent to your new email to verify.</p>
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

  /**
   * Render form for verifiying new email.
   **/
  renderConfirmationForm() {
    return (
      <div className="ConfirmationForm">
        <form onSubmit={this.handleEmailConfirmation}>
          <h3>Confirm your new email.</h3>
          <p>Please enter the confirmation code to verify your new email.</p>
          <FormGroup controlId="confirmationCode" bsSize="large">
            <ControlLabel>Confirmation Code</ControlLabel>
            <FormControl
              autoFocus
              type="tel"
              value={this.state.confirmationCode}
              onChange={this.handleChange}
            />
            <HelpBlock>Please check your email for your code. Make sure to
            check your junk/spam folder as well.</HelpBlock>
          </FormGroup>
          <LoaderButton
            block
            bsSize="large"
            disabled={!this.validateConfirmationForm()}
            type="submit"
            isLoading={this.state.isLoading}
            text="Verify email"
            loadingText="Verifying..."
          />
        </form>
        <div className="ResendButton">
          {this.state.resentCode
            ? <HelpBlock>A new confirmation code has been sent to your new email address.</HelpBlock>
            : <LoaderButton
                block
                onClick={this.resendConfirmationCode}
                disabled={this.state.resentCode}
                isLoading={this.state.resendIsLoading}
                type="submit"
                text="Not received the email?"
                loadingText="Resending code..." />}
        </div>
      </div>
    );
  }


}

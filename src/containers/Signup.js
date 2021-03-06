import React, { Component } from "react";
import {
  HelpBlock,
  FormGroup,
  FormControl,
  ControlLabel,
  Checkbox
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { Auth } from "aws-amplify";
import LoaderButton from "../components/LoaderButton";
import "./Signup.css";
import { API } from "aws-amplify";

/**
 * Two-page Sign Up with verification by code for Bounce Portal
 */
export default class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      email: "",
      password: "",
      confirmPassword: "",
      confirmationCode: "",
      firstName: "",
      lastName: "",
      companyName: "",
      agreeChecked: false,
      newUser: null,
      pageOneComplete: false
    };
  }

  /**
  * Validates page 1 of Sign Up form by checking all fields are filled in,
  * both password fields match exactly and the agreement checkbox is checked.
  */
  validateFormPageOne() {
    return (
      this.state.email.length > 0 &&
      this.state.password.length > 0 &&
      this.state.password === this.state.confirmPassword &&
      this.state.agreeChecked
    );
  }

  /**
  * Validates page 2 of Sign Up by checking all fields are filled in.
  */
  validateFormPageTwo() {
    return (
      this.state.firstName.length > 0 &&
      this.state.lastName.length > 0 &&
      this.state.companyName.length > 0
    );
  }

  /**
  * Validates confirmation code by checking it is filled in.
  */
  validateConfirmationForm() {
    return this.state.confirmationCode.length > 0;
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
  * Updates the state of the checkbox.
  **/
  handleChangeCheckbox = event => {
    this.setState({
      [event.target.id]: event.target.checked
    });
  }

  /**
  * Updates the state of sign up progression (after submitting page 1).
  */
  handleSubmitPageOne = async event => {
    event.preventDefault();

    this.setState({ isLoading: true, pageOneComplete: true });
    this.setState({ isLoading: false });
  }

  /**
  * Makes request to AWS Cognito to sign up user. Sign up progression is updated
  * upon error to redirect user back to page 1 of Sign up and make changes.
  * Since the state of fields are stored, the user only needs to make changes to
  * the fields with errors e.g. email already exists
  */
  handleSubmitPageTwo = async event => {
    event.preventDefault();

    this.setState({ isLoading: true });

    try {
      const newUser = await Auth.signUp({
        username: this.state.email,
        password: this.state.password,
        attributes: {
          'email': this.state.email,
          'given_name': this.state.firstName,
          'family_name': this.state.lastName,
          'custom:company_name': this.state.companyName,
          'custom:customer_ID': ''
        }
      });

      this.setState({
        newUser
      });

    } catch (e) {
      // currently all errors will redirect user back to page 1 of sign up form
      alert(e.message);
      this.setState({ pageOneComplete: false });

      /* For more specific error handling e.g. email already exists:
      if (e.message === "An account with the given email already exists.") {
        this.setState({ pageOneComplete: false });
      }
      */
    }

    this.setState({ isLoading: false });
  }

  /**
  * Confirms user account with code and automatically signs them in and redirects
  * to homepage for authenticated users (management portal landing). A Stripe
  * customer object is also created and stores the ID in Cognito custom attribute.
  **/
  handleConfirmationSubmit = async event => {
    event.preventDefault();

    this.setState({ isLoading: true });

    try {
      await Auth.confirmSignUp(this.state.email, this.state.confirmationCode);
      await Auth.signIn(this.state.email, this.state.password);

      // create a new customer object for this account in Stripe
      const stripeCustomer = await this.createStripeCustomer({
        email: this.state.email
      });
      // store the unique stripe customer ID in Cognito
      const user = await Auth.currentAuthenticatedUser();
      await Auth.updateUserAttributes(user, {
        "custom:customer_ID": stripeCustomer.customerID
      });

      // redirect user to homepage / management portal landing
      this.props.userHasAuthenticated(true);
      this.props.history.push("/");
    } catch (e) {
      alert(e.message);
      this.setState({ isLoading: false });
    }
  }

  /**
  * Calls backend API for creating a Stripe customer object.
  **/
  createStripeCustomer(email) {
    return API.post("notes", "/createCustomer", {
      body: email
    });
  }



  /**
  * Renders page 1 of Sign Up form with the following fields:
  * - Email
  * -
  */
  renderForm1() {
    return (
      <div className="signupform1">

        <form onSubmit={this.handleSubmitPageOne}>
        <h3>Improve your team today.</h3>
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
          <FormGroup controlId="password" bsSize="large">
            <ControlLabel>Create a Password</ControlLabel>
            <FormControl
              value={this.state.password}
              onChange={this.handleChange}
              type="password"
              placeholder="Minimum 8 characters"
            />
          </FormGroup>
          <FormGroup controlId="confirmPassword" bsSize="large">
            <ControlLabel>Confirm your Password</ControlLabel>
            <FormControl
              value={this.state.confirmPassword}
              onChange={this.handleChange}
              type="password"
              placeholder="Retype your password"
            />
          </FormGroup>
          <Checkbox
            id="agreeChecked"
            checked={this.state.agreeChecked}
            onChange={this.handleChangeCheckbox}
            title="agreeChecked">
            I have read and agree to Bounce&#39;s <Link to="/termsofservice">Terms of Service </Link>
            and <Link to="/privacypolicy">Privacy Policy</Link>.
          </Checkbox>
          <LoaderButton
            block
            bsSize="large"
            disabled={!this.validateFormPageOne()}
            type="submit"
            isLoading={this.state.isLoading}
            text="Sign Up"
            loadingText="Signing up…"
          />
        </form>
      </div>
    );
  }

  /**
   * Renders page 2 of Sign Up with the following fields:
   * - First Name
   * - Last Name
   * - Company Name
   * These are stored as attributes with user sign up profile in Cognito.
   */
  renderForm2() {
    return (
      <div className="signupform2">

        <form onSubmit={this.handleSubmitPageTwo}>
        <h3>Almost there.</h3>
          <FormGroup controlId="firstName" bsSize="large">
            <ControlLabel>First Name</ControlLabel>
            <FormControl
              value={this.state.firstName}
              onChange={this.handleChange}
              type="firstName"
              placeholder="John"
            />
          </FormGroup>
          <FormGroup controlId="lastName" bsSize="large">
            <ControlLabel>First Name</ControlLabel>
            <FormControl
              value={this.state.lastName}
              onChange={this.handleChange}
              type="lastName"
              placeholder="Smith"
            />
          </FormGroup>
          <FormGroup controlId="companyName" bsSize="large">
            <ControlLabel>Company Name</ControlLabel>
            <FormControl
              value={this.state.companyName}
              onChange={this.handleChange}
              type="companyName"
              placeholder="Bounce Technologies"
            />
          </FormGroup>
          <LoaderButton
            block
            bsSize="large"
            disabled={!this.validateFormPageTwo()}
            type="submit"
            isLoading={this.state.isLoading}
            text="Sign Up"
            loadingText="Signing up…"
          />
        </form>
      </div>
    )
  }

  /**
  * Renders verification page for user to input confirmation code from their email
  */
  renderConfirmationForm() {
    return (
      <div className="signup-verification">
        <form onSubmit={this.handleConfirmationSubmit}>
          <h3>One last step.</h3>
          <p id="verify">You&#39;ll receive an email within a few minutes to verify your
          account with a confirmation code. Please enter the code below.</p>
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
          <LoaderButton
            block
            bsSize="large"
            disabled={!this.validateConfirmationForm()}
            type="submit"
            isLoading={this.state.isLoading}
            text="Verify"
            loadingText="Verifying…"
          />
        </form>
      </div>
    );
  }

  /**
  * Decision for rendering page 1 or page 2 of sign up based on progression.
  */
  renderForm() {
    return (
      <div className="signup-form">
      {this.state.pageOneComplete
        ? this.renderForm2()
        : this.renderForm1()}
      </div>
    );
  }

  /**
  * Decision for rendering sign up form or verification based on progression.
  **/
  render() {
    return (
      <div className="Signup">
        {this.state.newUser === null
          ? this.renderForm()
          : this.renderConfirmationForm()}
      </div>
    );
  }
}

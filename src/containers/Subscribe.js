import React, { Component } from "react";
import { API, Auth } from "aws-amplify";
import { Elements, StripeProvider } from "react-stripe-elements";
import BillingForm from "../components/BillingForm";
import config from "../config";
import "./TestPaymentForm.css";
import { Button, Checkbox } from 'react-bootstrap';
import LoaderButton from "../components/LoaderButton";

export default class Subscribe extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      subscribed: false,
      confirmCancel: false,
      customerObj: null
    };
  }

  async componentWillMount() {
    try {
      // get customer stripe ID from cognito
      const userInfo = await Auth.currentUserInfo();
      const customer = userInfo.attributes["custom:customer_ID"];
      console.log(customer);
      // get customer object from stripe
      const customerObj = await this.getCustomer({customer});
      this.setState({ customerObj: customerObj })
      if (customerObj.subscriptions.data.length > 0) {
        this.setState({ subscribed: true });
      }

    } catch (e) {
      alert(e.message);
    }
  }

  getCustomer(details) {
    return API.post("notes", "/getCustomer", {
      body: details
    })
  }

  addPaymentMethod(details) {
    return API.post("notes", "/updateDefaultPaymentMethod", {
      body: details
    });
  }

  subscribe(details) {
    return API.post("notes", "/subscribe", {
      body: details
    });
  }

  handleChangeCheckbox = event => {
    this.setState({
      [event.target.id]: event.target.checked
    });
  }

  handleFormSubmit = async ({ token, error }) => {
    if (error) {
      alert(error);
      return;
    }

    this.setState({ isLoading: true });
    console.log("submitting payment info...");
    try {
      // get customer stripe ID from cognito
      const userInfo = await Auth.currentUserInfo();
      const customer = userInfo.attributes["custom:customer_ID"];
      console.log(customer);
      // add customer payment method
      await this.addPaymentMethod({
        customer,
        token: token.id
      });

      // subscribe customer to monthly plan
      // but how to know which plan ID to use? For now it is fixed to Bounce Premium
      const planID = 'plan_DPt2YPYzphRe5S';
      await this.subscribe({
        customer,
        planID,
      });

      alert("You're subscribed to Bounce!");
      this.props.history.push("/");
    } catch (e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  }

  handleCancelSubscription = async () => {
    console.log("cancelled");
  }

  renderPaymentForm() {
    return (
      <div className="SubscriptionPayment">
        <StripeProvider apiKey={config.STRIPE_KEY}>
          <Elements>
            <BillingForm
              loading={this.state.isLoading}
              onSubmit={this.handleFormSubmit}
            />
          </Elements>
        </StripeProvider>
      </div>
    );
  }


  renderSubscribed() {
    return (
      <div className="Subscribed">
        <form onSubmit={this.handleCancelSubscription}>
          <h3>Already subscribed.</h3>
          <Checkbox
            id="confirmCancel"
            checked={this.state.confirmCancel}
            onChange={this.handleChangeCheckbox}
            title="confirmCancel">
            I confirm that I want to cancel my Bounce subscription immediately.
          </Checkbox>
          <LoaderButton
            block
            bsSize="large"
            disabled={!this.state.confirmCancel}
            type="submit"
            isLoading={this.state.isLoading}
            text="Cancel my subscription"
            loadingText="Cancelling"
          />
        </form>
      </div>
    );
  }

  render() {
    return (
      <div className="Purchase Subscription">
        {this.state.subscribed ? this.renderSubscribed() : this.renderPaymentForm()}
      </div>
    );
  }
}

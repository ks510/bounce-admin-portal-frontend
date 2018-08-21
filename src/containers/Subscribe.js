import React, { Component } from "react";
import { API, Auth } from "aws-amplify";
import { Elements, StripeProvider } from "react-stripe-elements";
import BillingForm from "../components/BillingForm";
import config from "../config";
import "./TestPaymentForm.css";

export default class Subscribe extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false
    };
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

  handleFormSubmit = async (storage, { token, error }) => {
    if (error) {
      alert(error);
      return;
    }

    this.setState({ isLoading: true });
    console.log("submitting payment info...");
    try {
      // get customer stripe ID from cognito
      const userInfo = await Auth.currentUserInfo();
      const customerID = userInfo.attributes["custom:customer_ID"];
      console.log(customerID);
      // add customer payment method
      await this.addPaymentMethod({
        customerID,
        source: 'tok_gb'
      });

      // subscribe customer to monthly plan
      // but how to know which plan ID to use? For now it is fixed to Bounce Premium
      const planID = 'plan_DPt2YPYzphRe5S';
      await this.subscribe({
        customerID,
        planID,
      });

      alert("You're subscribed to Bounce!");
      this.props.history.push("/");
    } catch (e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  }

  render() {
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
}

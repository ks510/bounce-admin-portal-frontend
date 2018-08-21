import React, { Component } from "react";
import { API, Auth } from "aws-amplify";
import { Elements, StripeProvider } from "react-stripe-elements";
import BillingForm from "../components/BillingForm";
import config from "../config";
import "./TestPaymentForm.css";
import { Checkbox } from 'react-bootstrap';
import LoaderButton from "../components/LoaderButton";

export default class Subscribe extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      subscribed: false,
      confirmCancel: false,
      confirmReactivate: false,
      cancelled: false,
      customerObj: null
    };
  }

  async componentWillMount() {
    try {
      // get customer stripe ID from cognito
      const userInfo = await Auth.currentUserInfo();
      const customer = userInfo.attributes["custom:customer_ID"];

      // get customer object from stripe and store in component state
      const customerObj = await this.getCustomer({customer});
      this.setState({ customerObj: customerObj });

      // check if the customer has an active bounce subscription
      if (customerObj.subscriptions.data.length > 0) {
        this.setState({ subscribed: true });
      }
      // check if customer has active subscirption to be cancelled at the end of billing period
      if (customerObj.subscriptions.data[0].cancel_at_period_end) {
        this.setState({ cancelled: true });
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

  cancelSubscription(details) {
    return API.post("notes", "/cancelSubscription", {
      body: details
    });
  }

  handleCancelSubscription = async () => {
    this.setState({ isLoading: true });

    // get subscription id to cancel from customer object and call API
    const subscription = this.state.customerObj.subscriptions.data[0].id;
    await this.cancelSubscription({ subscription });
    this.setState({ subscribed: false });
    alert(`Subscription cancelled: ${subscription}`);

    try {
      // call cancel subscription API
    } catch (e) {
      alert(e.message);
    }

    this.setState({ isLoading: false });

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

/**
 * If the customer has an active subscription, render components based on whether
 * subscription is pending cancellation at the end of the billing period. This
 * enables users to reactivate the subscription if they change their mind.
 **/
  renderSubscribed() {
    return (
      <div className="Subscribed">
        <h3>Already subscribed.</h3>
        {this.state.cancelled
          ? <form onSubmit={this.handleReactivateSubscription}>
              <p>Your subscription will be cancelled at the end of this billing period</p>
              <Checkbox
                id="confirmReactivate"
                checked={this.state.confirmReactivate}
                onChange={this.handleChangeCheckbox}
                title="confirmReactivate">
                I confirm that I want to stay subscribed to Bounce and no longer wish to cancel my subscription at the end of this billing period.
              </Checkbox>
              <LoaderButton
                block
                bsSize="large"
                disabled={!this.state.confirmReactivate}
                type="submit"
                isLoading={this.state.isLoading}
                text="Stay Subscribed"
                loadingText="Resubscribing..."
              />
            </form>
          : <form onSubmit={this.handleCancelSubscription}>
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
            </form>}
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

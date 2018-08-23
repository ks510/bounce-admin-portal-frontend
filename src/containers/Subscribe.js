import React, { Component } from "react";
import { API, Auth } from "aws-amplify";
import { Elements, StripeProvider } from "react-stripe-elements";
import BillingForm from "../components/BillingForm";
import config from "../config";
import "./Subscribe.css";
import { Checkbox } from 'react-bootstrap';
import LoaderButton from "../components/LoaderButton";

/**
 * Renders the payment form or options to cancel/reactivate Bounce subscription
 * based on the status of user's Bounce subscription.
 **/
export default class Subscribe extends Component {
  constructor(props) {
    super(props);

    this.state = {
      customerObj: null,
      isLoading: false,
      subscribed: false,
      cancelled: false,
      confirmCancel: false,
      confirmReactivate: false
    };
  }

  /**
   * Fetches this user's subscription information from Stripe.
   **/
  async componentWillMount() {
    try {
      // get customer stripe ID from cognito and use it to get info from Stripe
      const userInfo = await Auth.currentUserInfo();
      const customer = userInfo.attributes["custom:customer_ID"];

      const customerObj = await this.getCustomer({customer});
      this.setState({ customerObj: customerObj });

      // does the customer have an active Bounce subscription?
      if (customerObj.subscriptions.data.length > 0) {
        this.setState({ subscribed: true });

        // has the customer cancelled their subscription for the end of this billing period?
        if (customerObj.subscriptions.data[0].cancel_at_period_end) {
          this.setState({ cancelled: true });
        }
      }


    } catch (e) {
      alert(e.message);
    }
  }

  /**
   * Call API for getting customer object from Stripe.
   **/
  getCustomer(details) {
    return API.post("notes", "/getCustomer", {
      body: details
    })
  }

  /**
   * Call API to update this customer's default payment method in Stripe.
   **/
  addPaymentMethod(details) {
    return API.post("notes", "/updateDefaultPaymentMethod", {
      body: details
    });
  }

  /**
   * Subscribe this customer to Bounce plan in Stripe. Calling this more than
   * once will create separate subscriptions - may need to implement a restriction
   * to check the user only has one plan at a time but state variables handle
   * this for now.
   **/
  subscribe(details) {
    return API.post("notes", "/subscribe", {
      body: details
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
   * Uses payment token as customer's default payment method and subscribes
   * the customer to Bounce Premium plan in Stripe. The customer is immediately
   * charged for the current billing period (£4.35)
   **/
  handleFormSubmit = async ({ token, error }) => {
    if (error) {
      alert(error);
      return;
    }

    this.setState({ isLoading: true });

    try {
      // get customer stripe ID from cognito and add payment method to Stripe
      const userInfo = await Auth.currentUserInfo();
      const customer = userInfo.attributes["custom:customer_ID"];

      await this.addPaymentMethod({
        customer,
        token: token.id
      });

      // subscribe customer to monthly plan
      // but how to know which plan ID to use? For now it is fixed to Bounce Premium £4.35
      const planID = 'plan_DPt2YPYzphRe5S';
      await this.subscribe({
        customer,
        planID,
      });

      alert("You're subscribed to Bounce!");
      this.props.history.push("/"); //redirect to portal landing page
    } catch (e) {

      alert(e);
      this.setState({ isLoading: false });
    }
  }

  /**
   * Call API to cancel Bounce subscription at the end of billing period in Stripe.
   **/
  cancelSubscription(details) {
    return API.post("notes", "/cancelSubscription", {
      body: details
    });
  }

 /**
  * Cancels Bounce subscription at the end of current billing period. Assumes
  * customer has only one subscription plan in Stripe as this method always
  * takes the id of first subscription plan in the customer's list from Stripe.
  **/
  handleCancelSubscription = async () => {
    this.setState({ isLoading: true });

    // get subscription id to cancel from customer object and call API
    const subscription = this.state.customerObj.subscriptions.data[0].id;

    try {
      await this.cancelSubscription({ subscription });
      this.setState({ subscribed: false });

    } catch (e) {
      alert(e.message);
    }

    this.setState({ isLoading: false });

  }

  /**
   * Call API to reactivate Bounce subscription by updating plan attribute
   * for cancelling at the end of billing period.
   **/
  reactivateSubscription(details) {
    return API.post("notes", "/reactivateSubscription", {
      body: details
    });
  }

  /**
   * Reactivate the current Bounce subscription that was pending cancellation
   * at the end of the billing period. Assumes customer only has one plan as it
   * always reactivates the first plan id in the Stripe customer list.
   **/
  handleReactivateSubscription = async () => {
    this.setState({ isLoading: true });

    // get subscription id to reactivate from customer object
    const subscription = this.state.customerObj.subscriptions.data[0].id;

    try {
      // reactivate subscription on stripe
      await this.reactivateSubscription({ subscription });
      this.setState({ cancelled: false });

    } catch (e) {
      alert(e.message);
    }

    this.setState({ isLoading: false });
  }

  /**
   * Render Stripe payment form for setting default payment for subscription.
   **/
  renderPaymentForm() {
    return (
      <div className="SubscriptionPayment">
        <h3>Start your Bounce Subscription today.</h3>
        <p>Only pay when its used by employees. Our subscription is simple,
        flexible and cost effective. Cancel at anytime.</p>
        <h3>Price plan</h3>
        <p>Metered billing 10p per exercise completed...</p>
        <br />
        <h3>Ready to start improving your team&#63;</h3>
        <p>Payment is automatically billed at the beginning of each billing period to your
        credit card. You can view your bill, charges, usage or cancel at anytime.</p>
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

  /**
   * Renders payment form or cancel/reactive form depending on customer's
   * subscription status.
   **/
  render() {
    return (
      <div className="Purchase Subscription">
        {this.state.subscribed ? this.renderSubscribed() : this.renderPaymentForm()}
      </div>
    );
  }
}

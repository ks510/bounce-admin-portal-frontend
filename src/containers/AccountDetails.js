import React, { Component } from "react";
import { Auth, API } from "aws-amplify";
import { ListGroup, ListGroupItem, Checkbox } from "react-bootstrap";
import LinkButton from "../components/LinkButton";
import "./AccountDetails.css";

export default class AccountDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: "",
      lastName: "",
      companyName: "",
      email: "",
      password: "*************",
      activeSubscription: false,
      billsByEmail: false,
      attributeNames: {
        firstName: "First Name",
        lastName: "Last Name",
        companyName: "Company Name",
        email: "Email",
        password: "Password",
        activeSubscription: "Active Bounce Subscription",
        billsByEmail: "Receive Bills by Email",
      }

    }
  }

  /**
   * Fetch customer account details from Cognito. Custom attributes must be
   * accessed differently (use slicing operating and prefix with "custom:" ).
   * Subscription status is fetched from Stripe customer object.
   **/
  async componentDidMount() {
    try {
      const userInfo = await Auth.currentUserInfo();
      this.setState({
        firstName: userInfo.attributes.given_name,
        lastName: userInfo.attributes.family_name,
        companyName: userInfo.attributes["custom:company_name"],
        email: userInfo.attributes.email
      });

      const customer = userInfo.attributes["custom:customer_ID"];
      console.log(customer);
      const customerObj = await this.getCustomer({ customer });

      // does the customer have an active Bounce subscription?
      if (customerObj.subscriptions.data.length > 0) {
        this.setState({ activeSubscription: true });
      }
    }
    catch(e) {
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
  * Updates the state of the checkbox.
  **/
  handleChangeCheckbox = event => {
    this.setState({
      [event.target.id]: event.target.checked
    });
  }

  /**
   * Render customer's account details as a list.
   **/
  render() {
    return (
      <div className="AccountDetails">
        <h3>Your account details.</h3>
        <ListGroup>
          {this.renderAccountDetails(this.state)}
        </ListGroup>
      </div>
    );
  }

  /**
   * Concatenate attribute names with the customer's details.
   **/
  renderAccountDetails(userDetails) {

    //keys list is sliced to omit the __proto__ object entry from array.
    const userInfo = Object.keys(userDetails).slice(0,7);
    return (
      userInfo.map(
        (key, index) =>
          <div>{this.renderAccountDetailsSwitch(key, this.state.attributeNames, userDetails)}</div>
      )
    );
  }

  /**
    * Handles rendering each user info entry correctly with/without buttons or
    * checkboxes.
    */
  renderAccountDetailsSwitch(key, attributeNames, userDetails) {
    switch (key) {
      case 'email':
        return <ListGroupItem
                >
                {this.getAttributeWithValue(attributeNames[key], userDetails[key])}
                <LinkButton
                  inline="true"
                  bsSize="small"
                  href="/account/changeemail"
                  text="Change"
                />
                </ListGroupItem>;
      case 'password':
        return <ListGroupItem
                >
                {this.getAttributeWithValue(attributeNames[key], userDetails[key])}
                <LinkButton
                  inline="true"
                  bsSize="small"
                  href="/account/changepassword"
                  text="Change"
                />
                </ListGroupItem>;
      case 'activeSubscription':
        return <ListGroupItem>
                {attributeNames[key].concat(': ')}
                <Checkbox
                  inline
                  id="bounceSubscriptionCheckbox"
                  checked={this.state.activeSubscription}
                  disabled={true}
                >
                  {this.state.activeSubscription ? 'Yes' : 'No' }
                </Checkbox>
                </ListGroupItem>;
      case 'billsByEmail':
      return <ListGroupItem>
              {attributeNames[key].concat('? ')}
              <Checkbox
                inline
                id="billsByEmail"
                checked={this.state.billsByEmail}
                onChange={this.handleChangeCheckbox}
              >
                {this.state.billsByEmail ? 'Yes' : 'No' }
              </Checkbox>
              </ListGroupItem>;
      default:
        return (
          <ListGroupItem>
          {this.getAttributeWithValue(attributeNames[key], userDetails[key])}
          </ListGroupItem>
        );
    }
  }

  /**
   * Formats each entry for displaying attribute name and user information.
   */
  getAttributeWithValue(attributeName, userInfo) {
    if (attributeName === "Email") {
      userInfo = this.hideEmail(userInfo);
    }
    if (attributeName === "Email" || attributeName === "Password") {
      userInfo = userInfo.concat(" ");
    }
    if (userInfo === undefined) {
      userInfo = '';
    }
    return `${attributeName}: ${userInfo}`;

  }

  /**
    * Partially hides user's email address by only revealing the first 4
    * characters, the @ and . symbols and the remaining characters after .
    */
  hideEmail(email) {
    let endOfDomainNameReached = false;
    const charArray = email.split('');
    charArray.forEach(function(character, index) {
      if (index > 3 && character !== '@' && character !== '.' && !endOfDomainNameReached) {
        charArray[index] = '*';
      } else if (character === '.') {
        endOfDomainNameReached = true;
      }
    });
    const hiddenEmail = charArray.join("");
    return hiddenEmail;
  }



}

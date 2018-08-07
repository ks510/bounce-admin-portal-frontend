import React, { Component } from "react";
import { Auth } from "aws-amplify";
import { ListGroup, ListGroupItem, Checkbox } from "react-bootstrap";
import LinkButton from "../components/LinkButton";

export default class Account extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: "",
      lastName: "",
      companyName: "",
      email: "",
      password: "***************",
      activeSubscription: false,
      billsByEmail: false,
    }
  }

  async componentDidMount() {
    try {
      const userInfo = await Auth.currentUserInfo();
      this.setState({
        firstName: userInfo.attributes.given_name,
        lastName: userInfo.attributes.family_name,
        companyName: userInfo.attributes.companyName,
        email: userInfo.attributes.email
      })
    }
    catch(e) {
      alert(e.message);
    }
  }

  handleChangeCheckbox = event => {
    this.setState({
      [event.target.id]: event.target.checked
    });
  }

  updateBillsByEmailChange = async => {
    this.handleChangeCheckbox;
    //this method should update user's bills by email preference to DB?
  }

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
  renderAccountDetails(userDetails) {
    const attributeNames = {
      firstName: "First Name",
      lastName: "Last Name",
      companyName: "Company Name",
      email: "Email",
      password: "Password",
      activeSubscription: "Active Bounce Subscription",
      billsByEmail: "Receive Bills by Email?"
    }

    const userInfo = Object.keys(userDetails);
    return (
      userInfo.map(
        (key, index) =>
          <div>{this.renderAccountDetailsSwitch(key, attributeNames, userDetails)}</div>
      )
    );
  }

  renderAccountDetailsSwitch(key, attributeNames, userDetails) {
    console.log(key);
    switch (key) {
      case 'email':
        return <ListGroupItem
                >
                {this.getAttributeWithValue(attributeNames[key], userDetails[key])}
                <LinkButton
                  inline="true"
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
                  href="/account/changepassword"
                  text="Change"
                />
                </ListGroupItem>;
      case 'activeSubscription':
        return <ListGroupItem>
                {attributeNames[key]}
                <Checkbox
                  inline
                  id="bounceSubscriptionCheckbox"
                  checked={this.state.activeSubscription}
                  disabled={true}
                  />
                </ListGroupItem>;
      case 'billsByEmail':
      return <ListGroupItem>
              {attributeNames[key]}
              <Checkbox
                inline
                id="billsByEmail"
                checked={this.state.billsByEmail}
                onChange={this.updateBillsByEmailChange}
                />
              </ListGroupItem>;
      default:
        return (
          <ListGroupItem
            header={this.getAttributeWithValue(attributeNames[key], userDetails[key])}
          >
          </ListGroupItem>
        );
    }
  }

  getAttributeWithValue(attributeName, userInfo) {
    if (attributeName === "Email" || attributeName === "Password") {
      userInfo = userInfo.concat(" ");
    }
    return `${attributeName}: ${userInfo}`;

  }



}

import React, { Component } from "react";
import { Auth } from "aws-amplify";
import { ListGroup, ListGroupItem, Checkbox } from "react-bootstrap";
import LinkButton from "../components/LinkButton";
import "./Account.css";

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
    //this method should also update user's bills by email preference to DB?
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
                onChange={this.handleChangeCheckbox}
                />
              </ListGroupItem>;
      default:
        return (
          <ListGroupItem>
          {this.getAttributeWithValue(attributeNames[key], userDetails[key])}
          </ListGroupItem>
        );
    }
  }

  getAttributeWithValue(attributeName, userInfo) {
    if (attributeName === "Email") {
      userInfo = this.hideEmail(userInfo);
    }
    if (attributeName === "Email" || attributeName === "Password") {
      userInfo = userInfo.concat(" ");
    }
    return `${attributeName}: ${userInfo}`;

  }

  /**
    * Partially hides user's email address by only revealing the first 4
    * characters and the @ symbol
    */
  hideEmail(email) {
    let endOfDomainNameReached = false;
    const charArray = email.split('');
    console.log(charArray);
    charArray.forEach(function(character, index) {
      if (index > 3 && character !== '@' && character !== '.' && !endOfDomainNameReached) {
        charArray[index] = '*';
      } else if (character === '.') {
        endOfDomainNameReached = true;
      }
    });
    const hiddenEmail = charArray.join("");
    console.log(hiddenEmail);
    return hiddenEmail;
  }



}

import React, { Component } from "react";

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
  
  render() {
    return (
      <div className="AccountDetails">
        <h3>Your account details.</h3>

      </div>
    );
  }


}

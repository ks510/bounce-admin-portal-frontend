import React, { Component } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "react-bootstrap";
import "./Home.css";

/**
 * Renders the home page components depending if the user is logged in or not.
 **/
export default class Home extends Component {

  // Default constructor used as no state required in this component yet.

  /**
   * Renders the home page for users that aren't logged in.
   **/
  renderLander() {
    return (
      <div className="lander">
        <h1>Bounce Admin Portal</h1>
        <p>A management portal for Team managers.</p>
        <div>
          <Link to="/login" className="btn btn-info btn-lg">
            Log In
          </Link>
          <Link to="/signup" className="btn btn-success btn-lg">
            Sign Up
          </Link>
        </div>
      </div>
    );
  }

  /**
   * Renders the management landing page if the user is logged in. This page
   * should show statistics/information about employee's Bounce usage.
   **/
  renderPortalLanding() {
    return (
      <div className="admin-portal-landing">
        <PageHeader>Bounce Admin Portal</PageHeader>
        <h3>Welcome back!</h3>
        <p>Here are some Bounce usage statistics...</p>
      </div>
    );
  }

  /**
   * Decision on which landing page to render depending if the user is logged in.
   **/
  render() {
    return (
      <div className="Home">
        {this.props.isAuthenticated ? this.renderPortalLanding() : this.renderLander()}
      </div>
    );
  }
}

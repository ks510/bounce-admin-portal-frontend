import React, { Component } from "react";
import { Auth } from "aws-amplify";
import { Link, withRouter } from "react-router-dom";
import { Nav, Navbar, NavItem, NavDropdown, MenuItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import Routes from "./Routes";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAuthenticated: false,
      isAuthenticating: true
    };
  }

  async componentDidMount() {
    try {
      if (await Auth.currentSession()) {
        this.userHasAuthenticated(true);
      }
    }
    catch(e) {
      if (e !== 'No current user') {
        alert(e);
      }
    }

    this.setState({ isAuthenticating: false });
  }

  userHasAuthenticated = authenticated => {
    this.setState({ isAuthenticated: authenticated });
  }

  handleLogout = async event => {
    await Auth.signOut();

    this.userHasAuthenticated(false);

    this.props.history.push("/login");
  }

  render() {
    const childProps = {
      isAuthenticated: this.state.isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated
    };

    return (
      !this.state.isAuthenticating &&
      <div className="App container">
        <Navbar fluid collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to="/">Bounce for Teams</Link>
            </Navbar.Brand>
            {this.state.isAuthenticated
              ? <Nav pullRight>
                  <NavItem onClick={this.handleLogout}>Log Out</NavItem>
                </Nav>
              : <Nav />}
          </Navbar.Header>
        </Navbar>
          <Navbar fluid collapseOnSelect>
            <Navbar.Header>
              <Navbar.Toggle />
            </Navbar.Header>
            <Navbar.Collapse>
              {this.state.isAuthenticated
                ? <div className="authenticated-navbar">
                  <Nav>
                    <LinkContainer to="/subscription">
                      <NavDropdown
                        title="Manage Subscription"
                        id="subscription-navdropdown" >
                        <LinkContainer to="/subscription/usage">
                          <MenuItem>Current Usage</MenuItem>
                        </LinkContainer>
                        <LinkContainer to="/subscription/payment">
                          <MenuItem>Purchase Subscription</MenuItem>
                        </LinkContainer>
                        <LinkContainer to="/subscription/paymentmethods">
                          <MenuItem>Manage Payment Methods</MenuItem>
                        </LinkContainer>
                        <LinkContainer to="/subscription/bills">
                          <MenuItem>Previous Bills</MenuItem>
                        </LinkContainer>
                      </NavDropdown>
                    </LinkContainer>
                    <LinkContainer to="/employees">
                      <NavItem>Manage Employees</NavItem>
                    </LinkContainer>
                    <LinkContainer to="/account">
                      <NavDropdown
                        title="Account Settings"
                        id="account-navdropdown" >
                        <LinkContainer to="/account/details">
                          <MenuItem>Account Details</MenuItem>
                        </LinkContainer>
                        <LinkContainer to="/account/changepassword">
                          <MenuItem>Change your password</MenuItem>
                        </LinkContainer>
                        <LinkContainer to="/account/changeemail">
                          <MenuItem>Change your email</MenuItem>
                        </LinkContainer>
                      </NavDropdown>
                    </LinkContainer>
                    <LinkContainer to="/advice">
                      <NavItem>Help & Support</NavItem>
                    </LinkContainer>
                  </Nav>
                  </div>
                : <Nav>
                    <LinkContainer to="/signup">
                      <NavItem>Sign Up</NavItem>
                    </LinkContainer>
                    <LinkContainer to="/login">
                      <NavItem>Log In</NavItem>
                    </LinkContainer>
                  </Nav>
              }
            </Navbar.Collapse>

          </Navbar>

        <Routes childProps={childProps} />
      </div>
    );
  }
}

export default withRouter(App);

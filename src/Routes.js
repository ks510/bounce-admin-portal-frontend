import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import Notes from "./containers/Notes";
import Login from "./containers/Login";
import Signup from "./containers/Signup";
import NewNote from "./containers/NewNote";
import NotFound from "./containers/NotFound";
import AppliedRoute from "./components/AppliedRoute";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";
import ForgotPassword from "./containers/ForgotPassword";
import TermsOfService from "./containers/TermsOfService";
import PrivacyPolicy from "./containers/PrivacyPolicy";
import ResetPasswordSuccess from "./containers/ResetPasswordSuccess";
import Account from "./containers/Account";
import AccountChangePassword from "./containers/AccountChangePassword";
import AccountChangeEmail from "./containers/AccountChangeEmail";
import Subscribe from "./containers/Subscribe";

export default ({ childProps }) =>
  <Switch>
    <AppliedRoute path="/" exact component={Home} props={childProps} />
    <UnauthenticatedRoute path="/login" exact component={Login} props={childProps} />
    <UnauthenticatedRoute path="/signup" exact component={Signup} props={childProps} />
    <UnauthenticatedRoute path="/forgotpassword" exact component={ForgotPassword} props={childProps} />
    <Route path="/termsofservice" exact component={TermsOfService} props={childProps} />
    <Route path="/privacypolicy" exact component={PrivacyPolicy} props={childProps} />
    <AuthenticatedRoute path="/subscription/subscribe" exact component={Subscribe} props={childProps} />
    <AuthenticatedRoute path="/notes/new" exact component={NewNote} props={childProps} />
    <AuthenticatedRoute path="/notes/:id" exact component={Notes} props={childProps} />
    <AuthenticatedRoute path="/account/details" exact component={Account} props={childProps} />
    <AuthenticatedRoute path="/account/changepassword" exact component={AccountChangePassword} props={childProps} />
    <AuthenticatedRoute path="/account/changeemail" exact component={AccountChangeEmail} props={childProps} />
    <AuthenticatedRoute path="/resetpasswordsuccess" exact component={ResetPasswordSuccess} props={childProps} />
    { /* Finally, catch all unmatched routes */ }
    <Route component={NotFound} />
  </Switch>;

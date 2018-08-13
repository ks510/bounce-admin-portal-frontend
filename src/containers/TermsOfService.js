import React, { Component } from "react";
import ReactRemarkable from "react-remarkable";
import markdownFile from "../terms-of-service/Bounce - Terms of Service.md";
import "./PolicyPages.css";


/**
 * Placeholder for display Bounce's privacy policy for users to view.
 */
export default class PrivacyPolicy extends Component {
  constructor(props) {
    super(props);

    this.state = {
      markdown: null
    }
  }


  async componentWillMount() {
    try {
      const response = await fetch(markdownFile);
      const markdownText = await response.text();
      this.setState({ markdown: markdownText });

    } catch (e) {
      alert(e);
    }
  }

  render() {
    return (
      <div className="privacy-policy">
        <ReactRemarkable source={this.state.markdown} />
      </div>
    );
  }
}

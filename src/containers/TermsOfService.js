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


  componentWillMount() {
    // load the text from file and store it in component state
    fetch(markdownFile)
      .then((r) => r.text())
      .then(text  => {
        this.setState({ markdown: text });
      })
  }

  render() {
    return (
      <div className="privacy-policy">
        <ReactRemarkable source={this.state.markdown} />
      </div>
    );
  }
}

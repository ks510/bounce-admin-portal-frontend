import React, { Component } from "react";
import marked from "marked";
import ReactMarkdown from "react-markdown";
import markdownFile from "../privacy-policy/Bounce - Privacy Policy.md";


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
    fetch(markdownFile)
      .then((r) => r.text())
      .then(text  => {
        this.setState({ markdown: text });
      })
  }

  render() {
    return (
      <div className="privacy-policy">
        <ReactMarkdown source={this.state.markdown} />
      </div>
    );
  }
}

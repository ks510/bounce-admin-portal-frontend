import React, { Component } from "react";
import ReactRemarkable from "react-remarkable";
import "./PolicyPages.css";
import { Base64 } from 'js-base64';

/**
 * Renders Bounce's Terms of Service from GitHub repo:
 * https://github.com/bouncetechnologies/terms-of-service
 **/
export default class TermsOfService extends Component {
  constructor(props) {
    super(props);

    this.state = {
      markdown: null
    }
  }


  /**
   * Fetch text file from GitHub repo. Based on absolute Github file path so
   * must update if file name is changed in the future.
   **/
  async componentWillMount() {

    try {
      // GET request for github file, contents of response is encoded in base64
      // decode contents using js-base64 library (works best for now!)
      const response = await fetch("https://api.github.com/repos/bouncetechnologies/terms-of-service/contents/Bounce%20-%20Terms%20of%20Service.md");
      const responseObjectAsText = await response.text()
      const jsonObject = JSON.parse(responseObjectAsText);
      const decodedText = Base64.decode(jsonObject["content"]);

      this.setState({ markdown: decodedText });

    } catch (e) {
      alert(e);
    }
  }

  render() {
    return (
      <div className="MarkdownDocument">
        <ReactRemarkable source={this.state.markdown} />
      </div>
    );
  }
}

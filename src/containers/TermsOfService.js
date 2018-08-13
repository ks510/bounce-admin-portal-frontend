import React, { Component } from "react";
import ReactRemarkable from "react-remarkable";
import markdownFile from "../terms-of-service/Bounce - Terms of Service.md";
import "./PolicyPages.css";
import { Base64 } from 'js-base64';

export default class PrivacyPolicy extends Component {
  constructor(props) {
    super(props);

    this.state = {
      markdown: null
    }
  }


  async componentWillMount() {

    try {
      // GET request for github file, contents of response is encoded in base64
      // do not use window.atob() as it doesn't decode properly!
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
      <div className="privacy-policy">
        <ReactRemarkable source={this.state.markdown} />
      </div>
    );
  }
}

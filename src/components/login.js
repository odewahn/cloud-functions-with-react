import React from "react";

import { connect } from "react-redux";

import RaisedButton from "material-ui/RaisedButton";

class WelcomePage extends React.Component {
  render() {
    return (
      <div>
        <h1>Hello, {this.props.User.get("email")}</h1>
        <RaisedButton label="Click me" />
      </div>
    );
  }
}
export default connect(state => state)(WelcomePage);

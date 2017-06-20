import React from "react";
import { fetchUserAccountType } from "../state/user";

import { connect } from "react-redux";

import RaisedButton from "material-ui/RaisedButton";

class WelcomePage extends React.Component {
  render() {
    return (
      <div>
        <h1>Hello, {this.props.User.get("email")}</h1>
        <RaisedButton
          label="Click me"
          onClick={() => {
            this.props.dispatch(fetchUserAccountType("andrew@odewahn.com"));
          }}
        />
      </div>
    );
  }
}
export default connect(state => state)(WelcomePage);

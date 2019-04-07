import React, { Component } from 'react';
import { isUserSignedIn } from 'blockstack';
import Typist from 'react-typist';

export default class Signin extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { handleSignIn } = this.props;

    return (
      <div className="panel-landing" id="section-1">
        <Typist><h1 className="landing-heading">Hello, Blockstack!</h1></Typist>
        <p className="lead">
          <button
            className="btn btn-primary btn-lg"
            id="signin-button"
            onClick={ handleSignIn.bind(this) }
          >
            Sign In with Blockstack
          </button>
        </p>
      </div>
    );
  }
}

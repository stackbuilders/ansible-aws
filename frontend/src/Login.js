import React, { Component } from 'react';
import {Button, Form, FormGroup, FormControl, InputGroup} from 'react-bootstrap';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: ""
    };
  }

  setUsername = evt => this.setState({username: evt.target.value})
  handleLogin = evt => {
    evt.preventDefault();
    this.props.onLogin(this.state.username);
  }

  render() {
    return (
      <div className="login">
        <h2>What's your name?</h2>
        <Form
          onSubmit={this.handleLogin}
        >
          <FormGroup>
            <InputGroup>
              <FormControl
                type="text"
                value={this.state.username}
                onChange={this.setUsername}
                />
              <InputGroup.Button>
                <Button
                  type="submit"
                  disabled={this.state.username.trim() === ""}
                >
                Log in
                </Button>
              </InputGroup.Button>
            </InputGroup>
          </FormGroup>
        </Form>
      </div>
    );
  }
}

export default Login;

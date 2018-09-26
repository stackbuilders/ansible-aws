import React, { Component } from 'react';
import logo from './sb.png';
import './App.css';
import Login from './Login';
import Chat from './Chat';
import config from './config'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      is_loading: false,
      auth_token: ""
    }
  }

  login = (username) => {
    const headers = new Headers(); 
    headers.append('Content-Type', 'application/json');
    this.setState({is_loading: true});
    fetch(config.serverURL + "/api/login", {
      method: "POST",
      body: JSON.stringify({username}),
      headers
    })
    .then(response => response.json())
    .then(body => this.setState({is_loading: false, auth_token: body.auth_token}))
    .catch(console.error);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">DevOps Minichat</h1>
        </header>
        {this.state.is_loading && <h1>Loading</h1>}
        {!this.state.is_loading && this.state.auth_token === "" && <Login onLogin={this.login}/>}
        {!this.state.is_loading && this.state.auth_token !== "" && <Chat token={this.state.auth_token}/>}
      </div>
    );
  }
}

export default App;

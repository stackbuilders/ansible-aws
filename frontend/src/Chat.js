import React, { Component } from 'react';
import config from './config';
import {Button, FormGroup, InputGroup, FormControl, Form} from 'react-bootstrap';

const colours = [
  "red", "green", "blue", "teal"
]

class Message extends Component {
  colourFor = username => {
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash  = ((hash << 5) - hash) + username.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }
    const colourIndex = hash % colours.length;
    return colours[colourIndex];
  }

  render() {
    const sender = this.props.sender;
    return [
      <dt
        key={0}
        style={{color: this.colourFor(sender)}}
      >{sender}</dt>,
      <dd
        key={1}
      >{this.props.message}</dd>
    ]
  }
}

class MessageList extends Component {
  render() {
    return (
      <dl className="dl-horizontal">
        {this.props.messages.map((m, key) => <Message key={key} {...m} />)}
      </dl>
    )
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current_message: "",
      messages: [],
      intervalID: null
    }
  }

  componentDidMount = () => {
    const intervalID = setInterval(this.fetchMessages, 5000);
    this.setState({intervalID});
    this.fetchMessages();
  }
  componentWillUnmount = () => {
    clearInterval(this.state.intervalID);
  }

  fetchMessages = () => {
    const headers = new Headers();
    headers.append("Authorization", "bearer " + this.props.token);
    fetch(config.serverURL + "/api/messages", {
      headers
    })
    .then(response => response.json())
    .then(messages => this.setState({messages}))
    .catch(console.error);
  }

  sendMessage = evt => {
    evt.preventDefault();
    const headers = new Headers();
    headers.append("Authorization", "bearer " + this.props.token);
    headers.append("Content-Type", "application/json");
    fetch(config.serverURL + "/api/messages", {
      method: "POST",
      body: JSON.stringify({message: this.state.current_message}),
      headers
    })
    .then(response => response.json())
    .then(messages => this.setState({messages}))
    .catch(console.error);
    this.setState({current_message: ""});
  }

  render() {
    return (
      <div>
        <MessageList messages={this.state.messages} />
        <Form
          onSubmit={this.sendMessage}
        >
          <FormGroup>
            <InputGroup>
              <FormControl
                type="text"
                value={this.state.current_message}
                onChange={evt => this.setState({current_message: evt.target.value})}
              />
              <InputGroup.Button
                disabled={this.state.current_message.trim() === ""}
              >
                <Button type="submit">Send</Button>
              </InputGroup.Button>
            </InputGroup>
          </FormGroup>
        </Form>
      </div>
    );
  }
}

export default App;

const express = require('express')
const bodyParser = require('body-parser')
const crypto = require('crypto');
const cors = require('cors');

const pgp = require('pg-promise')()

if(!process.env.PG_CONN_STRING) {
  throw new Error("PG_CONN_STRING environment variable not set");
}
const db = pgp(process.env.PG_CONN_STRING)

const SECRET = "SUPERSECRET";
const MAX_MESSAGES = 100;

const app = express();

function make_auth_token(username) {
    const hash = crypto.createHash('sha256');
    hash.update(`${username}${SECRET}`);
    return `${username}###${hash.digest('hex')}`;
}

function verify_auth_token(token) {
    const username = token.split("###")[0];
    const valid_token = make_auth_token(username);
    if (valid_token === token) {
      return username;
    } else {
      return null;
    }
}

// Global array of the last messages sent by the users
var messages = [];

function getMessages() {
  return [...messages].reverse();
}

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("../frontend/build"));

// Login endpoint
// Params (in body as JSON):
// - username(string): the username to use
// Returns (as JSON):
// - auth_token(string): a bearer token to use for this user
app.post('/api/login',
  (req, res) => {
    const username = req.body.username;
    if (!username) {
      return res.status(403).send("No username sent.");
    }
    const token = make_auth_token(username);
    res.send({auth_token: token});
  }
);

// check_db endpoint
// This endpoints checks that the minichat can reach the database
// No params.
// Returns:
// - {value: 123} if it succeeded
// - an 500 error if it couldn't connect to the DB
app.get('/api/check_db',
  (req, res) => {
    db.one('SELECT $1 AS value', 123)
    .then(function (data) {
      console.log('DATA:', data.value)
      res.send(data)
    })
    .catch(function (error) {
      console.log('ERROR:', error)
      res.status(500).send("Database is unavailable");
    })
  }
);

// List messages endpoint
// This endpoints gets the last list of messages
// Requires authentication: bearer token
// No params.
// Returns:
// - a list of {sender: username(string), message: message(string)}
// - an 401 error if you aren't authenticated, or the token is wrong
app.get('/api/messages',
  (req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    const user = verify_auth_token(token);
    if (user === null) {
      return res.status(401).send("Not authenticated.");
    }
    res.send(getMessages());
  }
);

// Post a message endpoint as the user you are currently authenticated.
// This endpoints posts a new message
// Requires authentication: bearer token
// Params (in body as JSON):
// - message(string): the message to post
// Returns:
// - The current list of messages (see the List messages endpoint)
// - an 401 error if you aren't authenticated, or the token is wrong
app.post('/api/messages',
  (req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    const user = verify_auth_token(token);
    if (user === null) {
      return res.status(401).send("Not authenticated.");
    }
    const message = req.body.message;
    if (typeof(message) !== "string") {
      return res.status(400).send("Invalid or no message provided.");
    }
    messages.unshift({sender: user, message});
    messages = messages.slice(0, MAX_MESSAGES);
    res.send(getMessages());
  }
);

const PORT = 3001;
app.listen(PORT, () => console.log(`Chat app listening on port ${PORT}!`));

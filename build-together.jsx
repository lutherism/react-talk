var React = require('react');
var reqwest = require('reqwest');

var App = React.createClass({
  //**
  //  Server Pinging code
  //**
  componentDidMount: function() {
    reqwest({
      url: "messages",
      method: "get",
      dataType: "application/json",
      success: this.updateMessages.bind(this)
    });
    this.updateTimer = this.requestMessages();
    this.getDOMNode().querySelector('input').focus();
  },
  componentWillUnMount: function() {
    clearTimeout(this.updateTimer);
  },
  requestMessages: function() {
    return setTimeout(function() {
      reqwest({
        url: "messages",
        method: "get",
        dataType: "application/json",
        success: this.updateMessages.bind(this)
      });
      this.updateTimer = this.requestMessages();
    }.bind(this), 5000);
  },
  updateMessages: function(data) {
    this.setState({
      messages: data
    });
  },
  postNewMessage: function(message) {
    reqwest({
      url: "/message",
      method: "post",
      data: {
        message: message,
        author: this.state.author,
        timestamp: Date.now()
      },
      dataType: "application/json",
      success: this.updateMessages.bind(this)
    });
  },

  getInitialState: function() {
    return {
      messages: [],
      messageText: "",
      author: ""
    };
  },
  render: function() {
    return (
      <div>
        <label>Your name:</label>
        <input
          placeholder="Anonymous"
          value={this.state.author}
          onChange={this.authorChange} />
        <ul>
          {this.state.messages.map(function(message) {
            return (
              <li>
                  {message.message}
                <small
                  style={{
                    color: 'grey',
                    marginLeft: 15
                  }}>
                  {message.author + ", "}
                  {(new Date(parseInt(message.timestamp))).toLocaleString()}
                </small>
              </li>
            );
          })}
          <li>
            <form>
              <input
                value={this.state.messageText}
                onChange={this.inputChange} />
              <button
                type="submit"
                onClick={this.submitMessage}>
                Submit
              </button>
            </form>
          </li>
        </ul>

      </div>
    );
  },

  authorChange: function(e) {
    this.setState({
      author: e.target.value
    });
  },

  inputChange: function(e) {
    this.setState({
      messageText: e.target.value
    });
  },

  submitMessage: function(e) {
    e.preventDefault();
    this.postNewMessage(this.state.messageText);

    this.setState({
      messageText: ""
    });
  }
});

React.render(<App />, document.body);

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
      data: {message: message},
      dataType: "application/json",
      success: this.updateMessages.bind(this)
    });
  },

  getInitialState: function() {
    return {
      messages: [],
      messageText: ""
    };
  },
  render: function() {
    return (
      <div>
        <ul>
          {this.state.messages.map(function(message) {
            return (
              <li>
                {message}
              </li>
            );
          })}
          <li>
            <input
              value={this.state.messageText}
              onChange={this.inputChange} />
            <button
              type="submit"
              onClick={this.submitMessage}>
              Submit
            </button>
          </li>
        </ul>

      </div>
    );
  },

  inputChange: function(e) {
    this.setState({
      messageText: e.target.value
    });
  },

  submitMessage: function(e) {
    this.postNewMessage(this.state.messageText);

    this.setState({
      messageText: ""
    });
  }
});

React.render(<App />, document.body);

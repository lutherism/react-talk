var StyleSheet = require('./styles.jsx');
var PGAssets = require('./pg-assets.js');
var React = require('react');
var reqwest = require('reqwest');

var Title = React.createClass({
  render: function() {
    return (
      <h1>
        {this.props.message}
      </h1>
    );
  }
});

var MessageStore = {
  _messages: [
    "This Chat room has begun."
  ],
  getMessages: function() {
    return this._messages.map(function(v) {
      return v;
    });
  },
  pushMessage: function(message) {
    this._messages = this._messages.concat(message);
  },
  setMessages: function() {

  },
};

function submitMessages(message) {
    request({
      url: "/message",
      method: "post",
      data: message,
      dataType: "application/json",
      success: function(messages) {
        MessageStore.setMessages(messages);
      }
    });
}

var Message = React.createClass({
  render: function() {
    return (
      <div style={{
          fontSize:"3em",
          color: "#FFFFFF",
          margin: "5px 15px 5px 25px",
        }}>
        <span>{this.props.text}</span>
      </div>
    );
  }
});

var MessageBody = React.createClass({
  render: function() {
    return (
      <div style={{
        padding: 25
        }}>
        {this.props.messages.map(function(message) {
          return <Message text={message} />;
        })}
      </div>
    );
  }
});

var App = React.createClass({
  getInitialState: function() {
    return {
      messages: [],
      messageText: "",
      autoRequest: true
    };
  },
  render: function() {
    return (
      <div style={{
        }}>
        <style>{"body {background-color:#CCCCCC; }"}</style>
        <Title message="Chat" />
        <MessageBody messages={this.state.messages} />

        <form>
          <div style={{
              width: "calc(100% - 150px)",
              padding: 15,
              display: "inline-block"
          }}>
            <PGAssets.FormField
              ref="chatForm">

              <PGAssets.InputField
                placeholder="Type a Message..."
                changeHandler={this.messageType}
                value={this.state.messageText}
                ref="chatBox"/>
            </PGAssets.FormField>
          </div>
          <div style={{
              float:"right",
              position: "relative",
              margin: 10
            }}>
            <PGAssets.Button
              role="additive"
              text="Submit"
              clickHandler={this.submitMessage} />
          </div>
        </form>
      </div>
    );
  },
  componentDidMount: function() {
    this.updateTimer = this.requestMessages();
  },
  requestMessages: function() {
    return setTimeout(function() {
      reqwest({
        url: "messages",
        method: "get",
        dataType: "application/json",
        success: this.updateMessages.bind(this)
      });
      if (this.state.autoRequest) {
        this.updateTimer = this.requestMessages();
      }
    }.bind(this), 2000);
  },
  commponentWillUnMount: function() {
    clearTimeout(this.updateTimer);
  },
  messageType: function(e) {
    this.setState({
      messageText: e.target.value
    });
  },
  submitMessage: function(e) {
    var newMessage = this.state.messageText,
      newMessages = this.state.messages.concat(newMessage);

    e.preventDefault();

    this.setState({
      messages: newMessages,
      messageText: ""
    });

    reqwest({
      url: "/message",
      method: "post",
      data: {message: newMessage},
      dataType: "application/json",
      success: this.updateMessages.bind(this)
    });
  },
  updateMessages: function(data) {
    this.setState({
      messages: data
    });
  }
});

React.render(<App />, document.body);

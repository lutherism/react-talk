var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');

var app = express();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(multer()); // for parsing multipart/form-data

app.set('port', (process.env.PORT || 5000));

var MessageStore = {
  _messages: [
    {
      message: "This Chat room has begun.",
      author: "bot",
      timestamp: Date.now()
    }
  ],
  getMessages: function() {
    return this._messages.map(function(v) {
      return v;
    });
  },
  pushMessage: function(message) {
    this._messages = this._messages.concat(message);
    return this._messages.length;
  },
};

app.use(express.static('public'));
app.use('/vendor', express.static('vendor'));

app.post('/message', function(req, resp) {
  if (typeof req.body === 'object' &&
    req.body.message) {
      MessageStore.pushMessage({
        message: req.body.message || "",
        author: req.body.author || "Anonymous",
        timestamp: req.body.timestamp || Date.now()
      });
    }

    resp.status(200).json(MessageStore.getMessages());
});

app.get('/messages', function(req, resp) {
  resp.status(200).json(MessageStore.getMessages());
});

var server = app.listen(app.get('port'), function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

var os = require('os');
var ifaces = os.networkInterfaces();

Object.keys(ifaces).forEach(function (ifname) {
  var alias = 0
    ;

  ifaces[ifname].forEach(function (iface) {
    if ('IPv4' !== iface.family || iface.internal !== false) {
      // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
      return;
    }

    if (alias >= 1) {
      // this single interface has multiple ipv4 addresses
      console.log(ifname + ':' + alias, iface.address);
    } else {
      // this interface has only one ipv4 adress
      console.log(ifname, iface.address);
    }
  });
});

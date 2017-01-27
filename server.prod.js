var express = require('express');
var rp = require('request-promise');

var app = express();
var config = require('./config.js');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/index.html');
});

app.post('/signup', (req, res) => {
  var obj = {
    'email_address': req.body.email,
    status: 'subscribed',
  };

  rp({
    method: 'POST',
    url: `https://us15.api.mailchimp.com/3.0/lists/${config.MAILCHIMP_LIST}/members`,
    auth: {
      user: 'any',
      password: config.MAILCHIMP_API,
    },
    header: {
      'Content-Type': 'application/json',
      'Authorization': `apikey ${config.MAILCHIMP_API}`,
    },
    json: obj,
  })
  .then((success) => {
    res.status(200).send(success);
  }).catch((err) => {
    res.status(500).send(err);
  });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

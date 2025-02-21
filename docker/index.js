var express = require('express');
var app = express();



app.use('/emr-admin-client',express.static( __dirname + '/kyeeeditor.admin.web'));

app.get('*', function(req, res) {
  res.sendFile( __dirname + '/kyeeeditor.admin.web/index.html' );
});


app.get('/emr-admin-client/admin', function (req, res) {
  var status = {
    "status":"UP"
  };

  res.send(status);
});



app.listen(29099,'0.0.0.0',function(){
  console.log('kyeeeditor.admin.web ready...')
});

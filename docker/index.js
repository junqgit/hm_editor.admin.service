var express = require('express');
var app = express();


app.get('/hm-editor-client/admin', function (req, res) {
  var status = {
    "status":"UP"
  };

  res.send(status);
});


app.listen(29099,'0.0.0.0',function(){
  console.log('hmEditor.admin.web ready...')
});

/// <reference path='_references.ts' />
import express = require("express");

var app = express();

app.use(express.static(__dirname + '/public'));

app.use('/',express.static(__dirname + '/public/app'));

// app.get('/', function(req, res){
//   res.send('Hello World');
// });


app.listen(process.env.PORT || 80, function() {
  console.log('Node app is running on port', process.env.PORT || 80);
});


export var App = app;
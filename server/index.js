const express = require('express');
const app = express();
const http = require('http').createServer(app);
const path = require('path');

app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, '../build')));

app.get('/', function(req, res) {
  console.log('get');
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const path = require('path');
const io = require('socket.io')(http);
const createHandlers = require('./handlers');
const clientManager = require('./ClientManager')()

app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, '../build')));

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

io.on('connection', function(socket){
  const {
    handleLogin
  } = createHandlers(socket, clientManager, null)
  socket.on('login', handleLogin)
});
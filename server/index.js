const express = require('express');
const app = express();
const http = require('http').createServer(app);
const path = require('path');
const io = require('socket.io')(http);
const createHandlers = require('./handlers');
const clientManager = require('./ClientManager')()
const chatroomManager = require('./ChatroomManager')();

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
    handleLogin,
    handleJoiningChatroom,
    handleReceivedMessage
  } = createHandlers(socket, clientManager, chatroomManager)
  socket.on('login', handleLogin)
  socket.on('joinChatroom', handleJoiningChatroom)
  socket.on('message', handleReceivedMessage)
  socket.on('disconnect', () => console.log('disconnected'))
});
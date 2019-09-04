module.exports = function (client, clientManager, chatroomManager) {
  function handleLogin(userName, callback) {
    if(!clientManager.isUsernameAvailable(userName))
      return callback('Username is already taken')
    clientManager.registerClient(client, userName)
    const id = chatroomManager.createChatroom();
    const createdChatroom = chatroomManager.getChatroomById(id);
    createdChatroom.addUser(client.id, {userName})
    callback(null, id);
  }
  return {
    handleLogin
  }
}
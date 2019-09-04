module.exports = function (client, clientManager, chatroomManager) {
  function handleLogin({userName, shouldCreateRoom, roomId}, callback) {
    if(!clientManager.isUsernameAvailable(userName))
      return callback('Username is already taken')
    clientManager.registerClient(client, userName)
    if (shouldCreateRoom) {
      const id = chatroomManager.createChatroom();
      callback(null, id);
    }
    else callback(null, roomId)
  }

  function handleJoiningChatroom(id, callback) {
    if(!clientManager.isClientRegistered(client))
      return callback({message: 'You are not logged in', code: 0})
    let chatroom = chatroomManager.getChatroomById(Number(id));
    if(!chatroom)
      return callback({message: 'There is no room with that ID', code: 1})
    chatroom.addUser(client.id, clientManager.getClientInfo(client))
    callback(null, 'Some data')
  }

  return {
    handleLogin,
    handleJoiningChatroom
  }
}
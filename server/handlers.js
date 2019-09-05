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
    //check whether room is existing or user is registered
    if(!clientManager.isClientRegistered(client))
      return callback({message: 'You are not logged in', code: 0})
    let chatroom = chatroomManager.getChatroomById(Number(id));
    if(!chatroom)
      return callback({message: 'There is no room with that ID', code: 1})
    chatroom.addUser(client)

    //send in response names of users that are are in the current room
    const usersInRoom = chatroom.getUsers()
    const userNames = usersInRoom.map(u =>  {
      const {userName} = clientManager.getClientInfo(u)
      return userName
    })
    const userName = clientManager.getClientInfo(client).userName
    callback(null, userNames)

    //notify other users, that new user joined
    chatroom.broadcastMessageExceptOwner(client, 'userJoined', {userName})
  }

  function handleReceivedMessage(data) {
    const {message, roomId} = data;
    let chatroom = chatroomManager.getChatroomById(Number(roomId))
    chatroom.addMessaage(client, message)
    const { userName } = clientManager.getClientInfo(client)
    chatroom.broadcastMessage('message', message, userName)
  }

  return {
    handleLogin,
    handleJoiningChatroom,
    handleReceivedMessage
  }
}
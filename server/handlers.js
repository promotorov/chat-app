module.exports = function (client, clientManager, chatroomManager) {
  function handleLogin({userName, shouldCreateRoom, roomId, peerId}, callback) {
    //register user and create room if needed
    if(!clientManager.isUsernameAvailable(userName))
      return callback('Username is already taken')
    clientManager.registerClient(client, userName, peerId)
    if (shouldCreateRoom) {
      const id = chatroomManager.createChatroom();
      callback(null, id);
    }
    else callback(null, roomId)
  }

  function handleJoiningChatroom({roomId, peerId}, callback) {
    //check whether room is existing or user is registered
    if(!clientManager.isClientRegistered(client))
      return callback({message: 'You are not logged in', code: 0})
    let chatroom = chatroomManager.getChatroomById(Number(roomId));
    if(!chatroom)
      return callback({message: 'There is no room with that ID', code: 1})
    chatroom.addUser(client)

    //send in response names of users that are are in the current room
    const usersInRoom = chatroom.getUsers()

    const usersInfo = usersInRoom.map(u => clientManager.getClientInfo(u))
    callback(null, usersInfo)

    //notify other users, that new user joined
    const userInfo = clientManager.getClientInfo(client)
    chatroom.broadcastMessageExceptOwner(client, 'userJoined', userInfo)
  }

  function handleReceivedMessage(data) {
    //send message all chat members
    const {message, roomId} = data;
    let chatroom = chatroomManager.getChatroomById(Number(roomId))
    chatroom.addMessaage(client, message)
    const { userName } = clientManager.getClientInfo(client)
    chatroom.broadcastMessage('message', message, userName)
  }

  function handleDisconnect() {
    if (clientManager.isClientRegistered(client)) {
      //notify chat room members, that user left
      const {userName} = clientManager.getClientInfo(client)
      const chatrooms = chatroomManager.getRooms();
      chatrooms.forEach(room => {
        if (room.hasUser(client))
          room.broadcastMessageExceptOwner(client, 'userLeft', {userName})
      })
      //delete user
      chatroomManager.deleteClientFromChatrooms(client)
      clientManager.deleteUser(client)
    }
  }

  return {
    handleLogin,
    handleJoiningChatroom,
    handleReceivedMessage,
    handleDisconnect
  }
}
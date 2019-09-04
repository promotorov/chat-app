const Chatroom = require('./Chatroom');

module.exports = function() {
  const chatrooms = [];
  let current_id = 0;

  function createChatroom() {
    chatrooms.push(Chatroom(current_id++))
    return current_id - 1
  }

  function getChatroomById(id) {
    return chatrooms.find(x => x.getId() === id);
  }

  return {
    createChatroom,
    getChatroomById
  }
}
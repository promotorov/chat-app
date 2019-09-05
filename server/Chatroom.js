module.exports = function(id) {
  const identifier = id;
  const members = new Map();
  let chatHistory = [];

  function addUser(client) {
    members.set(client.id, client)
  }

  function getId() {
    return identifier;
  }

  function getUsers() {
    return [...members.values()];
  }

  function addMessaage(client, message) {
    chatHistory.push({client, message})
  }

  function broadcastMessage(message, senderName) {
    members.forEach(m => m.emit('message', {message, senderName, date: new Date()}))
  }

  return {
    addUser,
    getId,
    getUsers,
    addMessaage,
    broadcastMessage
  }
}
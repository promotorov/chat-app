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

  function broadcastMessage(eventType, message, senderName) {
    members.forEach(m => m.emit(eventType, {message, senderName, date: new Date()}))
  }

  function broadcastMessageExceptOwner(owner, eventType, message, senderName) {
    members.forEach(m => {
      if(m.id !== owner.id)
        m.emit(eventType, {message, senderName, date: new Date()})
    })
  }

  function deleteUser(client) {
    members.delete(client.id)
  }

  function hasUser(client) {
    return members.has(client.id)
  }

  return {
    addUser,
    getId,
    getUsers,
    addMessaage,
    broadcastMessage,
    broadcastMessageExceptOwner,
    deleteUser,
    hasUser
  }
}
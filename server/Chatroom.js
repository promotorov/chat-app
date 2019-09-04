module.exports = function(id) {
  const identifier = id;
  const members = new Map();
  let chatHistory = [];

  function addUser(client, data) {
    members.set(client.id, data)
  }

  function getId() {
    return identifier;
  }

  function getUsers() {
    return members.values();
  }

  return {
    addUser,
    getId,
    getUsers
  }
}
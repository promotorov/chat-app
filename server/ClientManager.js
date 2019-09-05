module.exports = function() {
  const clients = new Map();

  function registerClient(client, userName) {
    clients.set(client.id, {userName});
  }

  function isUsernameAvailable(userName) {
    return ![...clients.values()].map(x => x.userName).some(name => name === userName);
  }

  function isClientRegistered(client) {
    return clients.has(client.id)
  }

  function getClientInfo(client) {
    return clients.get(client.id)
  }

  function deleteUser(client) {
    clients.delete(client.id)
  }

  return {
    registerClient,
    isUsernameAvailable,
    isClientRegistered,
    getClientInfo,
    deleteUser
  }
}
module.exports = function() {
  const clients = new Map();

  function registerClient(client, userName) {
    clients.set(client.id, {userName});
  }

  function isUsernameAvailable(userName) {
    return ![...clients.values()].map(x => x.userName).some(name => name === userName);
  }

  return {
    registerClient,
    isUsernameAvailable
  }
}
module.exports = function (client, clientManager, chatroomManager) {
  function handleLogin(userName, callback) {
    if(!clientManager.isUsernameAvailable(userName))
      return callback('Username is already taken')
    clientManager.registerClient(client, userName)
    //TODO
    /*
    * create new room for user and return its id in callback
    */
    callback(null, userName);
  }
  return {
    handleLogin
  }
}
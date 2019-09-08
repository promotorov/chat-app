import React, { useState } from 'react';
import { Input } from 'reactstrap';
import { roomBeforeLogin } from './common'

function Login({socket, history, peerId}) {
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function handleKeyPress(event) {
    if (event.charCode === 13) {
      if (event.target.value.trim().length === 0)
        return;
      setLoading(true);
      setError(null);
      const shouldCreateRoom = !roomBeforeLogin.id
      const transferData = {
        userName: event.target.value,
        shouldCreateRoom,
        roomId: roomBeforeLogin.id,
        peerId
      }
      socket.emit('login', transferData, function (error, data) {
        setLoading(false);
        if(error)
          setError(error);
        else
          history.push(`rooms/${data}`)
      });
      event.target.value = "";
    }
  }

  return (
    <div>
      <Input
        placeholder="Username"
        onKeyPress={event => handleKeyPress(event)}
      />
      {isLoading && <div>Loading...</div>}
      {error && <div>{error}</div>}
    </div>
  )
}

export default Login;
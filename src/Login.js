import React, { useState } from 'react';
import { Input } from 'reactstrap';
import { roomBefroreLogin } from './common'

function handleKeyPress(event, socket, setLoading, setError, history) {
  if (event.charCode === 13) {
    if (event.target.value.trim().length === 0)
      return;
    setLoading(true);
    setError(null);
    const shouldCreateRoom = !roomBefroreLogin.id
    const transferData = {
      userName: event.target.value,
      shouldCreateRoom,
      roomId: roomBefroreLogin.id
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

function Login({socket, history}) {
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  return (

    <div>
      <Input
        placeholder="Username"
        onKeyPress={event => handleKeyPress(event, socket, setLoading, setError, history)}
      />
      {isLoading && <div>Loading...</div>}
      {error && <div>{error}</div>}
    </div>
  )
}

export default Login;
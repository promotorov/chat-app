import React, { useState, useEffect }from 'react'
import { Link } from 'react-router-dom'
import { roomBeforeLogin } from './common'
import { Input } from 'reactstrap'
import MessagesList from './MessageList'

function sendMessage(event, socket, roomId) {
  if (event.charCode === 13) {
    const message = event.target.value;
    if (message.trim().length === 0)
      return;
    socket.emit('message', {message, roomId})
    event.target.value = ""
  }
}

function Room({id, socket}) {
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isReady, setReady] = useState(false);

  useEffect(function () {
    socket.emit('joinChatroom', id, function (error, data) {
      setLoading(false);
      if (error)
        setError(error)
      else
        setReady(true)
    })
  }, [])

  if (isReady)
    socket.on('message', function messageListener(data) {
      console.log('handler triggered');
      socket.removeEventListener('message', messageListener)
      setMessages([...messages, data])
    })

  return (
    <div>
      {isLoading && <div>Loading...</div>}
      {error && <div>
        {error.message}
        {error.code === 0 && <div>
          <Link to="/" onClick={function () {
            roomBeforeLogin.id = id;
          }}>Login</Link>
        </div>}
      </div>}
      {!isLoading && !error && <div>
        You joined the room with id {id}
        <Input placeholder="message" onKeyPress={(event) => sendMessage(event, socket, id)}/>
        <div style={{height: '400px'}}>
          <MessagesList data={messages} />
        </div>
      </div> }
    </div>
  )
}
export default Room
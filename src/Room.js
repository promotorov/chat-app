import React, { useState, useEffect }from 'react'
import { Link } from 'react-router-dom'
import { roomBeforeLogin } from './common'
import { Button, Input } from 'reactstrap'
import MessagesList from './MessageList'
import UserList from './UserList'

function sendMessage(event, socket, roomId) {
  //Enter
  if (event.charCode === 13) {
    const message = event.target.value;
    if (message.trim().length === 0)
      return;
    socket.emit('message', {message, roomId})
    event.target.value = ""
  }
}

function Room({id, socket, peer, peerId}) {
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isReady, setReady] = useState(false);
  const [users, setUsers] = useState([]);
  const [streamState, setStreamState] = useState({myCalls: [], isStreaming: false});
  //const [remoteCalls, setRemoteCalls] = useState([]);

  // Delete listeners before state is updated
  function deleteScoketListeners() {
    socket.removeAllListeners('message')
    socket.removeAllListeners('userJoined')
    socket.removeAllListeners('userLeft')
    peer.removeAllListeners('call')
  }

  useEffect(function () {
    socket.emit('joinChatroom', {roomId: id, peerId}, function (error, data) {
      setLoading(false);
      if (error)
        setError(error)
      else {
        setUsers([...data])
        setReady(true)
      }
    })
  }, [])

  if (isReady) {
    socket.on('message', function messageListener(data) {
      deleteScoketListeners()
      setMessages([...messages, data])
    })
    socket.on('userJoined', function userJoinedListener(data) {
      console.log(data.message)
      deleteScoketListeners()
      setUsers([...users, data.message])
    })
    socket.on('userLeft', function userLeftListener(data) {
      const copiedUsers = [...users];
      console.log(data.message.userName)
      console.log(copiedUsers)
      let leftUserIndex = copiedUsers.findIndex(x => x.userName === data.message.userName)
      console.log(leftUserIndex)
      const {peerId} = copiedUsers[leftUserIndex]
      copiedUsers.splice(leftUserIndex, 1);
      console.log(copiedUsers)
      deleteScoketListeners()
      setUsers(copiedUsers)
      document.getElementById(`audioHeader${peerId}`).remove()
      document.getElementById(`audio${peerId}`).remove()
    })
    peer.on('call', function(call) {
      call.answer()
      call.on('stream', function(stream) {
        const container = document.getElementById('remoteAudio')
        const audioElement = document.createElement('audio')
        const header = document.createElement('p')
        audioElement.controls = 'controls'
        audioElement.autoplay = 'true'
        audioElement.srcObject = stream
        audioElement.id = `audio${call.peer}`
        header.innerHTML = users.find(u => u.peerId === call.peer).userName
        header.id = `audioHeader${call.peer}`
        container.appendChild(header)
        container.appendChild(audioElement)
      })
      call.on('close', function() {
        console.log('close')
        document.getElementById(`audioHeader${call.peer}`).remove()
        document.getElementById(`audio${call.peer}`).remove()
      })
    })
  }

  function startAudioStreaming() {
    navigator.getUserMedia({audio: true, video:false}, stream => {
      console.log('got access to audio device');

      const calls = users.map(u => u.peerId)
        .filter(id => id !== peerId)
        .map(id => peer.call(id, stream))
      deleteScoketListeners()
      setStreamState({myCalls: calls, isStreaming: true})
    }, (err) => {
      console.log('Failed to get local stream', err);
    });
  }

  function stopVideoStreaming() {
    streamState.myCalls.forEach(call => call.close())
    deleteScoketListeners()
    setStreamState({myCalls: [], isStreaming: false})
  }

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
        <div>
          <UserList data={users.map(u => u.userName)}/>
        </div>
        {!streamState.isStreaming &&<Button onClick={startAudioStreaming}>Start audio</Button>}
        {streamState.isStreaming && <Button onClick={stopVideoStreaming}>Stop audio</Button>}
        <div id={'remoteAudio'}>
        </div>
      </div> }
    </div>
  )
}
export default Room
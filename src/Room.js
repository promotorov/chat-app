import React, { useState, useEffect }from 'react'
import { Link } from 'react-router-dom'
import { roomBeforeLogin } from './common'
import { Button, Input } from 'reactstrap'
import MessagesList from './MessageList'
import List from './List'

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

let activeStream;

function Room({id, socket, peer, peerId}) {
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isReady, setReady] = useState(false);
  const [users, setUsers] = useState([]);
  const [streamState, setStreamState] = useState({myCalls: [], isStreaming: false, error});

  // Delete listeners before state is updated
  function deleteSocketListeners() {
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
      deleteSocketListeners()
      setMessages([...messages, data])
    })
    socket.on('userJoined', function userJoinedListener(data) {
      deleteSocketListeners()
      setUsers([...users, data.message])
      if (streamState.isStreaming) {
        console.log(activeStream)
        const call = peer.call(data.message.peerId, activeStream)
        setStreamState({...streamState, myCalls: [...streamState.myCalls, call]})
      }
    })
    socket.on('userLeft', function userLeftListener(data) {
      const copiedUsers = [...users];
      let leftUserIndex = copiedUsers.findIndex(x => x.userName === data.message.userName)
      const {peerId} = copiedUsers[leftUserIndex]
      copiedUsers.splice(leftUserIndex, 1);
      deleteSocketListeners()
      setUsers(copiedUsers)
      deleteRemoteAudio(peerId)
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
        deleteRemoteAudio(call.peer)
      })
    })
  }

  function deleteRemoteAudio(id) {
    const header = document.getElementById(`audioHeader${id}`)
    const audio = document.getElementById(`audio${id}`)
    if (header)
      header.remove()
    if (audio)
      audio.remove()
  }

  function startAudioStreaming() {
    navigator.mediaDevices.getUserMedia({audio: true, video: false})
      .then(stream => {
        const calls = users.map(u => u.peerId)
          .filter(id => id !== peerId)
          .map(id => peer.call(id, stream))
        activeStream = stream;
        deleteSocketListeners()
        setStreamState({myCalls: calls, isStreaming: true, error: undefined})
      })
      .catch(err => {
        setStreamState({myCalls: [], isStreaming: false, error: err})
      });
  }

  function stopAudioStreaming() {
    streamState.myCalls.forEach(call => call.close())
    deleteSocketListeners()
    setStreamState({myCalls: [], isStreaming: false, error: undefined})
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
          <List data={users.map(u => u.userName)}/>
        </div>
        {streamState.error && <div>{streamState.error}</div>}
        {!streamState.isStreaming &&<Button onClick={startAudioStreaming}>Start audio</Button>}
        {streamState.isStreaming && <Button onClick={stopAudioStreaming}>Stop audio</Button>}
        <div id={'remoteAudio'}>
        </div>
      </div> }
    </div>
  )
}
export default Room
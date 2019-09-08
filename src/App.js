import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from './Login';
import Notfound from './Notfound';
import Room from './Room'
import socketIOClient from "socket.io-client"

import Peer from 'peerjs'

const socket = socketIOClient();

const peer = new Peer({host: 'localhost', port: 9000, path: '/'});

function App() {
  const [peerId, setPeerId] = useState(undefined)

  peer.on('open', function(id) {
    console.log('My peer ID is: ' + id);
    setPeerId(id)
  });

  return (
    <Router>
      <div>
        <Switch>
          <Route path="/" exact component={({history}) => <div>
            { peer && <Login socket={socket} history={history} peerId={peerId}/> }
            { !peer && <div>Loading...</div>}
          </div>}
          />
          <Route path="/rooms/:id" component={({match}) => <Room
            peer={peer}
            peerId={peerId}
            socket={socket}
            id={match.params.id}/>}
          />
          <Route component={Notfound} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;

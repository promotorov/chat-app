import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from './Login';
import Notfound from './Notfound';
import Room from './Room'
import socketIOClient from "socket.io-client"


const socket = socketIOClient();

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/" exact component={({history}) => <Login socket={socket} history={history}/>} />
          <Route path="/rooms/:id" component={({match}) => <Room socket={socket} id={match.params.id}/>} />
          <Route component={Notfound} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;

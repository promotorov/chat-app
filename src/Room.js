import React, { useState, useEffect }from 'react'
import { Link } from 'react-router-dom'

function Room({id, socket}) {
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    socket.emit('joinChatroom', id, function (error, data) {
      setLoading(false);
      if(error)
        setError(error)
    })
  }, [])

  return (
    <div>
      {isLoading && <div>Loading...</div>}
      {error && <div>
        {error.message}
        {error.code === 0 && <div><Link to="/">Login</Link></div>}
      </div>}
      {!isLoading && !error && <div> You joined the room with id {id}</div>}
    </div>
  )
}
export default Room
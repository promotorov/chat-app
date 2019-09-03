import React from 'react'

function Room(props) {
  const { params } = props.match;

  return (
    <div>
      <h1>Room</h1>
      <p>{params.id}</p>
    </div>
  )
}
export default Room
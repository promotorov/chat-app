import React from 'react'

function MessageList({data}) {
  return(
    <div style={{
      overflow: 'auto',
      height: '100%',
      display: 'block',
      width: '100%',
      'background-color': 'yellow'
    }}>
      <ul>
        {data.map(x => <li>
          <div>{x.senderName}</div>
          <div style={{overflow: 'hidden'}}>
            <div style={{float: 'left'}}>{x.message}</div>
            <div style={{float: 'right'}}>{x.date}</div>
          </div>
        </li>)}
      </ul>
    </div>
  )
}

export default MessageList
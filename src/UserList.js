import React from 'react'

function UserList({data}) {
  return (
    <div>
      <ul>
        {data.map(x => <li>
          {x}
        </li>)}
      </ul>
    </div>
  )
}

export default UserList
import React from 'react'

function List({data}) {
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

export default List
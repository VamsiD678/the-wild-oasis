"use client"

import { useState } from "react"

export default function Counter() {

  const [users, setUsers] = useState(0)

  return (
    <div>
      <p>No.of users {users}</p>
      <button onClick={()=>setUsers(c=>c+1)}>{users}</button>
    </div>
  )
}
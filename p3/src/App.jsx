import { useState } from 'react'
import './App.css'
import { useEffect } from 'react'

function App() {
  const [time, setTime]=useState(new Date());
  useEffect(()=>{
    const interval = setInterval(()=>{
      setTime(new Date());
    },1000);
    return ()=>clearInterval(interval);
  },[]);
  return (
      <div>
        <h1>Welcome To Charusat!!!!</h1>
        <h3>It is {time.toLocaleDateString()}</h3>
        <h3>It is {time.toLocaleTimeString()}</h3>
      </div>
  )
}

export default App
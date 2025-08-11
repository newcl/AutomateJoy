import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import N8nStatus from './N8nStatus'
import { Flex, Progress } from 'antd';


function App() {
  

  return (
    <div>
      <Flex gap="small" vertical>
    
    <Progress percent={50} status="active" />
  </Flex>      
      <N8nStatus />
      
    </div>
  )
}

export default App

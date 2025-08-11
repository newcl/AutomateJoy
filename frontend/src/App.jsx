
import React, { useEffect, useState } from 'react';

import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import N8nStatus from './N8nStatus'
import { Flex, Progress, Spin } from 'antd';

const { ipcRenderer } = window.require('electron');


function App() {
  const [markerExists, setMarkerExists] = useState(null);
  const [progress, setProgress] = useState(0);


  useEffect(() => {
    

    async function check() {
      console.log(window);
      console.log(window.electronAPI);
      const exists = await window.electronAPI.checkMarkerFile();
      setMarkerExists(exists);
    }
    check();

    ipcRenderer.on('untar-progress', (event, prog) => {
      setProgress(prog);
      check();
    });
  }, []);

  if (markerExists === null || !markerExists) {
    return (<Flex gap="small" vertical>
      <Spin size='large' />
      {progress != null && <Progress value={progress} />}
    </Flex>      );
  }

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

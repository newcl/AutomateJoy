
import React, { useEffect, useState } from 'react';

import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import N8nPanel from './N8nStatus'
import { Flex, Progress, Spin } from 'antd';

function App() {
  const [markerExists, setMarkerExists] = useState(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    async function check() {
      const exists = await window.electronAPI.checkMarkerFile();
      setMarkerExists(exists);
    }
    check();
    
    window.electronAPI.onUntarComplete(() => {
      setMarkerExists(true);
    });

    window.electronAPI.onUntarProgress((prog) => {
      setProgress(prog);
      check(); // your custom function
    });
  }, []);

  if (markerExists === null) {
    return (<Flex gap="small" vertical>
      <Spin size='large' />
    </Flex>      );
  }

  if (!markerExists) {
    return (<Flex gap="small" vertical>
      <Spin size='large' />
      {progress != null && <Progress percent={(progress*100).toFixed(2)} status="active" />}
      <div>This app is for testing purpose only.</div>
      <div>Please use <a href='https://n8n.partnerlinks.io/li25lnhmcj8f'>n8n.com</a> for hosted experience.</div>
    </Flex>      );
  }

  return (
    <div>
      <N8nPanel />
    </div>
  )
}

export default App

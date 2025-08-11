import React, { useEffect, useState } from 'react';
import { Button, Spin } from 'antd';

const openUrl = () => {
  window.electronAPI.openUrl('http://localhost:5678')
}


function N8nStatus() {
  const [status, setStatus] = useState('starting');

  useEffect(() => {
    let intervalId;

    async function checkN8n() {
      try {
        const response = await fetch('http://localhost:5678'); // or '/' if /health not available
        if (response.ok) {
          setStatus('ready');
          clearInterval(intervalId); // stop polling once ready
        } else {
          setStatus('loading');
        }
      } catch (err) {
        setStatus('loading');
      }
    }

    // Start polling every 1 second
    intervalId = setInterval(checkN8n, 1000);

    // Run once immediately
    checkN8n();

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      {<Button type="primary" loading={status !== 'ready'} disabled={status !== 'ready'} onClick={openUrl}>Open n8n In Browser</Button>}
      <div>This app is for testing purpose only.</div>
      <div>Please use <a href='https://n8n.com'>n8n.com</a> for hosted experience.</div>
    </div>
  );
}

export default N8nStatus;

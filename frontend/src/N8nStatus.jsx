import React, { useEffect, useState } from 'react';

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
      <h3>n8n Status: {status}</h3>
      {status === 'loading' && <div>Loading n8n backend...</div>}
      {status === 'ready' && <div>n8n is ready!</div>}
    </div>
  );
}

export default N8nStatus;

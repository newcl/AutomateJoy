1. Ctrl-c still doesnt release port 

process.on('SIGINT', async () => {
  console.log('SIGINT received, stopping n8n...');
  if (n8nProcess) {
    await stopN8n({ preventDefault: () => {} });
  }
  process.exit(0);
});
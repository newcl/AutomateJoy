1. Ctrl-c still doesnt release port 

process.on('SIGINT', async () => {
  console.log('SIGINT received, stopping n8n...');
  if (n8nProcess) {
    await stopN8n({ preventDefault: () => {} });
  }
  process.exit(0);
});


2. Progress update upon unzipping 

3. Update text copy in the main ui
- Open In Browser Button && Copy URL button
- Add text to 
  - Visit n8n.com for get better UX 
  - n8n templates 
  - contact me? FAQ? 

4.Features 
- Open my n8n data folder 

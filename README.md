# Pody - n8n Workflow Automation

Pody is an Electron app that will embed n8n without any modification or violating any of their license model. The only goal for this app is for average users to experience n8n, and we recommend them to try n8n.io for production uses.

## Current Status

This is a basic Electron app that will be enhanced to embed n8n. Currently, it's just a simple Electron application with a clean UI.

## User Experience (Planned)

The user experience will be to run the server within the Electron app when user completes installation and clicks the app icon. Users can then use their browser to access n8n at `localhost:7777`. When they close the app window, n8n shuts down automatically.

## Development

### Prerequisites

- Node.js 18+ 
- npm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd pody

# Install dependencies
npm install

# Start the app
npm start

# Start in development mode (with DevTools)
npm run dev
```

### Project Structure

```
pody/
├── main.js              # Main Electron process
├── index.html           # Main UI
├── package.json         # Dependencies and scripts
└── README.md
```

## Next Steps

- [ ] Add n8n as a dependency
- [ ] Create n8n process manager
- [ ] Implement n8n startup/shutdown logic
- [ ] Add status monitoring UI
- [ ] Create browser integration
- [ ] Add data persistence
- [ ] Build distribution packages

## License

This project is licensed under the MIT License. n8n will be used in accordance with their license terms.
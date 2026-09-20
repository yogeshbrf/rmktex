import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const serverDir = path.resolve(rootDir, '..', 'server');

// Step 1: Start Central Backend (port 5000)
console.log('Starting Central Backend on port 5000...');
const backendProcess = spawn('node', [path.join(serverDir, 'index.js')], {
  cwd: serverDir,
  stdio: 'inherit',
  shell: true
});

// Step 2: Start API Proxy (port 3001)
console.log('Starting API Proxy on port 3001...');
const apiProcess = spawn('node', [path.join(rootDir, 'server.js')], {
  cwd: rootDir,
  stdio: 'inherit',
  shell: true
});

// Step 3: Start Frontend Preview (port 5173)
console.log('Starting Frontend Preview on http://localhost:5173...');
const viteProcess = spawn('npx', ['vite', 'preview', '--port', '5173'], {
  cwd: rootDir,
  stdio: 'inherit',
  shell: true
});

process.on('SIGINT', () => {
  backendProcess.kill();
  apiProcess.kill();
  viteProcess.kill();
  process.exit();
});

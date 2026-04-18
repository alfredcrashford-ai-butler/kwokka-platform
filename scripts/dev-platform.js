const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Kwokka Platform...');

const composeFile = path.join(__dirname, '..', 'docker-compose.local.yaml');

const docker = spawn('docker', ['compose', '-f', composeFile, 'up', '-d', '--build'], {
  stdio: 'inherit',
  cwd: path.join(__dirname, '..')
});

docker.on('close', (code) => {
  if (code !== 0) {
    console.error(`Docker compose exited with code ${code}`);
    process.exit(1);
  }
  console.log('✅ Platform is running!');
  console.log('🌐 Access the platform at: http://local.kwokka.co:8081');
});

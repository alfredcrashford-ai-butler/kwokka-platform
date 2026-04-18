const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const { spawn } = require('child_process');

async function start() {
  const gamesDir = path.join(__dirname, '..', 'games');
  
  if (!fs.existsSync(gamesDir)) {
    console.error('No games/ directory found at project root');
    process.exit(1);
  }
  
  const games = fs.readdirSync(gamesDir).filter(file => 
    fs.statSync(path.join(gamesDir, file)).isDirectory()
  );

  if (games.length === 0) {
    console.error('No games found in games/ directory');
    process.exit(1);
  }

  const { selectedGame } = await inquirer.prompt([
    {
      type: 'list',
      name: 'selectedGame',
      message: 'Which game would you like to start?',
      choices: games,
    },
  ]);

  console.log(`Starting ${selectedGame}...`);

  const commands = [
    { name: 'backend', cmd: `npm run dev -w games/${selectedGame}/backend` },
    { name: 'frontend', cmd: `npm run dev -w games/${selectedGame}/frontend` },
    { name: 'landing', cmd: `npm run dev -w games/${selectedGame}/landing` },
  ];

  const concurrently = require('concurrently');
  
  concurrently(
    commands.map(c => ({ command: c.cmd, name: c.name })),
    {
      names: commands.map(c => c.name),
      prefix: 'prefix',
      prefixLength: 10,
      killOthers: ['failure'],
      restartTries: 3,
    }
  ).catch((err) => {
    console.error('Failed to start game:', err);
    process.exit(1);
  });
}

start();

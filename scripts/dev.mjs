import { spawn } from 'node:child_process';
import { getExecutable, getRunArgs, getWorkspacePath, resolvePackageManager } from './workspace-utils.mjs';

function startWorkspace(workspaceName, scriptName, options = {}) {
  const workspacePath = getWorkspacePath(workspaceName);
  const packageManager = resolvePackageManager(workspacePath);
  const executable = getExecutable(packageManager);
  const args = getRunArgs(packageManager, scriptName);

  return spawn(executable, args, {
    cwd: workspacePath,
    stdio: options.stdio ?? 'inherit',
    shell: true,
  });
}

const backend = startWorkspace('backend', 'start:dev', {
  stdio: ['ignore', 'inherit', 'inherit'],
});

const frontend = startWorkspace('frontend', 'start');

let isShuttingDown = false;

function shutdown(exitCode = 0) {
  if (isShuttingDown) return;
  isShuttingDown = true;

  if (!backend.killed) backend.kill('SIGINT');
  if (!frontend.killed) frontend.kill('SIGINT');

  setTimeout(() => process.exit(exitCode), 150);
}

backend.on('exit', (code) => {
  if (!isShuttingDown) {
    console.error(`Backend exited with code ${code ?? 0}. Stopping frontend...`);
    shutdown(code ?? 0);
  }
});

frontend.on('exit', (code) => {
  if (!isShuttingDown) {
    console.error(`Frontend exited with code ${code ?? 0}. Stopping backend...`);
    shutdown(code ?? 0);
  }
});

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));

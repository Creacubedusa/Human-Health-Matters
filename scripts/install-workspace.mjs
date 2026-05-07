import { spawn } from 'node:child_process';
import {
  getExecutable,
  getInstallArgs,
  getWorkspacePath,
  resolvePackageManager,
} from './workspace-utils.mjs';

const [workspaceName] = process.argv.slice(2);

if (!workspaceName) {
  console.error('Usage: node scripts/install-workspace.mjs <workspace>');
  process.exit(1);
}

const workspacePath = getWorkspacePath(workspaceName);
const packageManager = resolvePackageManager(workspacePath);
const executable = getExecutable(packageManager);
const args = getInstallArgs(packageManager);

const child = spawn(executable, args, {
  cwd: workspacePath,
  stdio: 'inherit',
  shell: true,
});

child.on('exit', (code) => {
  process.exit(code ?? 0);
});

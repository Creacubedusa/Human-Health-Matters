import { spawn } from 'node:child_process';
import { getExecutable, getRunArgs, getWorkspacePath, resolvePackageManager } from './workspace-utils.mjs';

const [workspaceName, scriptName, ...extraArgs] = process.argv.slice(2);

if (!workspaceName || !scriptName) {
  console.error('Usage: node scripts/run-workspace.mjs <workspace> <script>');
  process.exit(1);
}

const workspacePath = getWorkspacePath(workspaceName);
const packageManager = resolvePackageManager(workspacePath);
const executable = getExecutable(packageManager);
const args = [...getRunArgs(packageManager, scriptName), ...extraArgs];

const child = spawn(executable, args, {
  cwd: workspacePath,
  stdio: 'inherit',
  shell: true,
});

child.on('exit', (code) => {
  process.exit(code ?? 0);
});

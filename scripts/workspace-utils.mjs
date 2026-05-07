import { existsSync } from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

export function getWorkspacePath(workspaceName) {
  return path.resolve(process.cwd(), workspaceName);
}

export function getPackageManagerPreference(workspacePath) {
  const hasPackageLock = existsSync(path.join(workspacePath, 'package-lock.json'));
  const hasPnpmLock = existsSync(path.join(workspacePath, 'pnpm-lock.yaml'));

  if (hasPackageLock) return 'npm';
  if (hasPnpmLock) return 'pnpm';
  return 'npm';
}

export function getExecutable(command) {
  return command;
}

export function isCommandAvailable(command) {
  const executable = getExecutable(command);
  const result = spawnSync(executable, ['--version'], {
    stdio: 'ignore',
    shell: true,
  });

  return result.status === 0;
}

export function resolvePackageManager(workspacePath) {
  const preferred = getPackageManagerPreference(workspacePath);
  if (isCommandAvailable(preferred)) return preferred;

  const fallback = preferred === 'npm' ? 'pnpm' : 'npm';
  if (isCommandAvailable(fallback)) return fallback;

  throw new Error(
    `Neither ${preferred} nor ${fallback} is available on this machine. Install one of them to run ${workspacePath}.`,
  );
}

export function getRunArgs(packageManager, scriptName) {
  return packageManager === 'pnpm'
    ? ['run', scriptName]
    : ['run', scriptName];
}

export function getInstallArgs(packageManager) {
  return packageManager === 'pnpm' ? ['install'] : ['install'];
}

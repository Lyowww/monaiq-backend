/**
 * Dev entrypoint: starts the Go translation service on :8000, waits until the port is open,
 * then runs `nest start --watch`. Use `npm run start:dev:api-only` to skip the sidecar.
 *
 * Resolves `@nestjs/cli` from the backend package first, then the monorepo root (hoisted install).
 */
const { spawn } = require('child_process');
const fs = require('fs');
const { createConnection } = require('net');
const path = require('path');

const backendDir = path.resolve(__dirname, '..');
const repoRoot = path.resolve(backendDir, '..');
const translationAppDir = path.resolve(repoRoot, 'translation-app');

/** npm sometimes forwards stray args (e.g. mistaken `--port`); accept numeric PORT override. */
const portArg = process.argv[2];
if (portArg && /^\d+$/.test(portArg) && !process.env.PORT) {
  process.env.PORT = portArg;
}

function resolveNestSpawn() {
  const roots = [backendDir, repoRoot];
  for (const root of roots) {
    const shim = path.join(root, 'node_modules', '.bin', 'nest');
    if (fs.existsSync(shim)) {
      return { command: shim, args: ['start', '--watch'] };
    }
  }
  for (const root of roots) {
    try {
      const entry = require.resolve('@nestjs/cli/bin/nest.js', { paths: [root] });
      if (fs.existsSync(entry)) {
        return { command: process.execPath, args: [entry, 'start', '--watch'] };
      }
    } catch {
      /* try next root */
    }
  }
  return null;
}

function waitForPort(port, host = '127.0.0.1', timeoutMs = 45000) {
  const started = Date.now();
  return new Promise((resolve, reject) => {
    const attempt = () => {
      const socket = createConnection({ port, host }, () => {
        socket.end();
        resolve(undefined);
      });
      socket.on('error', () => {
        socket.destroy();
        if (Date.now() - started > timeoutMs) {
          reject(new Error(`Timeout waiting for ${host}:${port} (translation service)`));
        } else {
          setTimeout(attempt, 250);
        }
      });
    };
    attempt();
  });
}

const go = spawn('go', ['run', 'main.go'], {
  cwd: translationAppDir,
  stdio: 'inherit',
  env: { ...process.env }
});

go.on('error', (err) => {
  console.error(
    '[translation] Failed to start (is Go installed and is translation-app present?)',
    err.message
  );
  process.exit(1);
});

void (async () => {
  try {
    await waitForPort(8000);
    console.log('[translation] Listening on :8000');
  } catch (e) {
    console.error('[translation]', (e && e.message) || e);
    go.kill('SIGTERM');
    process.exit(1);
  }

  const nestSpawn = resolveNestSpawn();
  if (!nestSpawn) {
    console.error(
      '[nest] Could not find @nestjs/cli. From the repo root run: npm install\n' +
        '  (Nest is often hoisted to the root node_modules in npm workspaces.)'
    );
    go.kill('SIGTERM');
    process.exit(1);
  }

  const nest = spawn(nestSpawn.command, nestSpawn.args, {
    cwd: backendDir,
    stdio: 'inherit',
    env: { ...process.env }
  });

  nest.on('error', (err) => {
    console.error('[nest] Failed to spawn:', err.message);
    go.kill('SIGTERM');
    process.exit(1);
  });

  const shutdown = () => {
    nest.kill('SIGTERM');
    go.kill('SIGTERM');
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);

  nest.on('exit', (code) => {
    go.kill('SIGTERM');
    process.exit(code ?? 0);
  });
})();

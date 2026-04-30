import type { NextFunction, Request, Response } from 'express';

function redact(value: unknown): unknown {
  if (!value || typeof value !== 'object') return value;
  if (Array.isArray(value)) return value.map(redact);

  const obj = value as Record<string, unknown>;
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (k.toLowerCase().includes('password')) {
      out[k] = '[redacted]';
    } else {
      out[k] = redact(v);
    }
  }
  return out;
}

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();

  res.on('finish', () => {
    const ms = Date.now() - start;
    const status = res.statusCode;

    const base = {
      method: req.method,
      path: req.originalUrl,
      status,
      ms,
    };

    if (status >= 400) {
      const safeBody = req.body ? redact(req.body) : undefined;
      console.log(JSON.stringify({ level: 'warn', ...base, body: safeBody }));
      return;
    }

    console.log(JSON.stringify({ level: 'info', ...base }));
  });

  next();
}


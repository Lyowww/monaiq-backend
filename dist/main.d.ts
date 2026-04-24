import type { Request, Response } from 'express';
/**
 * Vercel may treat `src/main` as the serverless entry; a default export is required
 * (see "No exports found in module" / "Did you forget to export a function or a server?").
 */
export default function vercelHandler(request: Request, response: Response): Promise<void>;

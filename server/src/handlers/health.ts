import type { RequestHandler } from 'express';

export const healthHandler: RequestHandler = (_req, res) => {
  res.status(200).json({ status: 'ok' });
};

export default healthHandler;

import cors from 'cors';
import express from 'express';
import type { RequestHandler } from 'express';

export const app = express();
const port = process.env.PORT ?? 3000;

app.use(cors());
app.use(express.json());

export const healthHandler: RequestHandler = (_req, res) => {
  res.status(200).json({ status: 'ok' });
};

app.get('/health', healthHandler);

/* c8 ignore start */
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}
/* c8 ignore end */

export default app;

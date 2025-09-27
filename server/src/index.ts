import cors from 'cors';
import express from 'express';
import healthRouter from './routes/health';
import attachGeo from './middleware/attachGeo';

export const app = express();
const port = process.env.PORT ?? 3000;

app.use(cors());
app.use(express.json());
app.use(attachGeo);

app.use('/health', healthRouter);

/* c8 ignore start */
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}
/* c8 ignore end */

export default app;

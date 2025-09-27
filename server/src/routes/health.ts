import { Router } from 'express';
import { healthHandler } from '../handlers/health';

export const healthRouter = Router();

healthRouter.get('/', healthHandler);

export default healthRouter;

import type { RequestHandler } from 'express';
import { lookupIp, resolveClientIp } from '../services/ipinfo';

export const attachGeo: RequestHandler = async (req, res, next) => {
  if (!process.env.IPINFO_TOKEN) {
    return next();
  }

  const ip = resolveClientIp(req);

  if (!ip) {
    return next();
  }

  try {
    const geo = await lookupIp(ip);

    if (geo) {
      res.locals.geo = geo;
    }
  } catch (error) {
    console.warn('Failed to enrich request with geolocation data', error);
  }

  next();
};

export default attachGeo;

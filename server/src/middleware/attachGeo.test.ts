import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import type { Request, Response, NextFunction } from 'express';
import attachGeo from './attachGeo';
import * as ipinfo from '../services/ipinfo';

type MutableResponse = {
  locals: Record<string, unknown>;
};

describe('attachGeo middleware', () => {
  const originalToken = process.env.IPINFO_TOKEN;

  let req: Partial<Request>;
  let res: MutableResponse;
  let next: NextFunction;

  beforeEach(() => {
    vi.restoreAllMocks();
    process.env.IPINFO_TOKEN = originalToken;
    req = {
      headers: {},
      socket: { remoteAddress: undefined } as unknown as Request['socket'],
    };
    res = { locals: {} };
    next = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    process.env.IPINFO_TOKEN = originalToken;
  });

  it('skips lookup when the IPINFO token is missing', async () => {
    process.env.IPINFO_TOKEN = '';
    const resolveSpy = vi.spyOn(ipinfo, 'resolveClientIp');
    const lookupSpy = vi.spyOn(ipinfo, 'lookupIp');

    await attachGeo(req as Request, res as unknown as Response, next);

    expect(resolveSpy).not.toHaveBeenCalled();
    expect(lookupSpy).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
    expect(res.locals.geo).toBeUndefined();
  });

  it('short-circuits when no client IP can be resolved', async () => {
    process.env.IPINFO_TOKEN = 'token';
    vi.spyOn(ipinfo, 'resolveClientIp').mockReturnValue('');
    const lookupSpy = vi.spyOn(ipinfo, 'lookupIp');

    await attachGeo(req as Request, res as unknown as Response, next);

    expect(lookupSpy).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('stores geo data on the response when lookup succeeds', async () => {
    process.env.IPINFO_TOKEN = 'token';
    vi.spyOn(ipinfo, 'resolveClientIp').mockReturnValue('203.0.113.1');
    vi.spyOn(ipinfo, 'lookupIp').mockResolvedValue({
      ip: '203.0.113.1',
      city: 'Example City',
      region: 'Example Region',
      country: 'ZZ',
      source: 'ipinfo',
      cached: false,
    });

    await attachGeo(req as Request, res as unknown as Response, next);

    expect(res.locals.geo).toEqual({
      ip: '203.0.113.1',
      city: 'Example City',
      region: 'Example Region',
      country: 'ZZ',
      source: 'ipinfo',
      cached: false,
    });
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('logs a warning when lookup throws and still calls next', async () => {
    process.env.IPINFO_TOKEN = 'token';
    vi.spyOn(ipinfo, 'resolveClientIp').mockReturnValue('203.0.113.2');
    vi.spyOn(ipinfo, 'lookupIp').mockRejectedValue(new Error('network error'));
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    await attachGeo(req as Request, res as unknown as Response, next);

    expect(warnSpy).toHaveBeenCalledWith(
      'Failed to enrich request with geolocation data',
      expect.any(Error),
    );
    expect(next).toHaveBeenCalledTimes(1);
    expect(res.locals.geo).toBeUndefined();
  });
});

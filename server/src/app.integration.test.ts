import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import app from './index';
import * as ipinfo from './services/ipinfo';

describe('app integration', () => {
  const originalToken = process.env.IPINFO_TOKEN;

  beforeEach(() => {
    vi.restoreAllMocks();
    process.env.IPINFO_TOKEN = originalToken;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    process.env.IPINFO_TOKEN = originalToken;
  });

  it('responds to /health and attempts to enrich geo data', async () => {
    process.env.IPINFO_TOKEN = 'token';
    const resolveSpy = vi.spyOn(ipinfo, 'resolveClientIp').mockReturnValue('203.0.113.10');
    const lookupSpy = vi.spyOn(ipinfo, 'lookupIp').mockResolvedValue({
      ip: '203.0.113.10',
      source: 'ipinfo',
      cached: false,
    });

    const response = await request(app).get('/health').set('x-forwarded-for', '203.0.113.10');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
    expect(resolveSpy).toHaveBeenCalledTimes(1);
    expect(lookupSpy).toHaveBeenCalledWith('203.0.113.10');
  });

  it('returns a 404 for unknown routes', async () => {
    const response = await request(app).get('/nope');
    expect(response.status).toBe(404);
  });
});

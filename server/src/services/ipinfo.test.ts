import { describe, expect, beforeEach, afterEach, it, vi } from 'vitest';
import type { IncomingMessage } from 'node:http';
import { lookupIp, resolveClientIp, clearIpInfoCache } from './ipinfo';

describe('ipinfo service', () => {
  let fetchSpy: ReturnType<typeof vi.spyOn> | undefined;

  beforeEach(() => {
    clearIpInfoCache();
    delete process.env.IPINFO_TOKEN;
    fetchSpy = undefined;
  });

  afterEach(() => {
    clearIpInfoCache();
    if (fetchSpy) {
      fetchSpy.mockRestore();
      fetchSpy = undefined;
    }
    delete process.env.IPINFO_TOKEN;
  });

  it('returns null for private addresses', async () => {
    process.env.IPINFO_TOKEN = 'test-token';
    const result = await lookupIp('127.0.0.1');
    expect(result).toBeNull();
  });

  it('returns null when IPINFO_TOKEN is missing', async () => {
    const result = await lookupIp('1.1.1.1');
    expect(result).toBeNull();
  });

  it('queries ipinfo and caches the result', async () => {
    process.env.IPINFO_TOKEN = 'test-token';
    fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue({
        ok: true,
        json: async () => ({
          ip: '1.1.1.1',
          city: 'City',
          region: 'Region',
          country: 'CC',
          loc: '12.34,56.78',
        }),
      } as unknown as Response);

    const result = await lookupIp('1.1.1.1');
    expect(result).toEqual({
      ip: '1.1.1.1',
      city: 'City',
      region: 'Region',
      country: 'CC',
      latitude: 12.34,
      longitude: 56.78,
      source: 'ipinfo',
      cached: false,
    });

    const cached = await lookupIp('1.1.1.1');
    expect(cached).toEqual({
      ip: '1.1.1.1',
      city: 'City',
      region: 'Region',
      country: 'CC',
      latitude: 12.34,
      longitude: 56.78,
      source: 'ipinfo',
      cached: true,
    });

    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it('resolves IP address from headers or socket info', () => {
    const req = {
      headers: {
        'x-forwarded-for': '203.0.113.1, 198.51.100.2',
      },
      socket: { remoteAddress: '198.51.100.1' },
      ip: '198.51.100.3',
    } as unknown as IncomingMessage & Parameters<typeof resolveClientIp>[0];

    const ip = resolveClientIp(req);
    expect(ip).toBe('203.0.113.1');

    const reqWithoutHeader = {
      headers: {},
      socket: { remoteAddress: '198.51.100.1' },
      ip: '198.51.100.3',
    } as unknown as IncomingMessage & Parameters<typeof resolveClientIp>[0];

    const ip2 = resolveClientIp(reqWithoutHeader);
    expect(ip2).toBe('198.51.100.1');
  });
});

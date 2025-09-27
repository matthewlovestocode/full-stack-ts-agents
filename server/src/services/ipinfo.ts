import type { Request } from 'express';

const IPINFO_BASE_URL = 'https://ipinfo.io';
const DEFAULT_TIMEOUT_MS = parseInt(process.env.IPINFO_TIMEOUT_MS ?? '3000', 10);
const DEFAULT_CACHE_TTL_MS = parseInt(process.env.IPINFO_CACHE_TTL_MS ?? '300000', 10);

interface IpInfoRawResponse {
  ip: string;
  city?: string;
  region?: string;
  country?: string;
  loc?: string;
  [key: string]: unknown;
}

interface CacheEntry {
  expiresAt: number;
  value: GeoLookupValue;
}

interface GeoLookupValue {
  ip: string;
  city?: string;
  region?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
}

export interface GeoLookupResult extends GeoLookupValue {
  source: 'ipinfo';
  cached: boolean;
}

const cache = new Map<string, CacheEntry>();

const privateIpMatchers = [
  /^(::1|::ffff:127\.[0-9.]+)$/,
  /^127\./,
  /^10\./,
  /^192\.168\./,
  /^169\.254\./,
  /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
  /^0\.0\.0\.0$/,
  /^localhost$/i,
];

const getNormalizedIp = (ip: string | undefined | null): string => {
  if (!ip) return '';
  const first = Array.isArray(ip) ? ip[0] : ip.split(',')[0];
  const trimmed = first.trim();
  return trimmed.startsWith('::ffff:') ? trimmed.replace('::ffff:', '') : trimmed;
};

const isPublicIp = (ip: string): boolean => {
  if (!ip) return false;
  return !privateIpMatchers.some((regex) => regex.test(ip));
};

const getCacheKey = (ip: string): string => ip;

const getTimeout = (): number => {
  return Number.isFinite(DEFAULT_TIMEOUT_MS) ? DEFAULT_TIMEOUT_MS : 3000;
};

const getCacheTtl = (): number => {
  return Number.isFinite(DEFAULT_CACHE_TTL_MS) ? DEFAULT_CACHE_TTL_MS : 300000;
};

const extractLatLong = (loc?: string): { latitude?: number; longitude?: number } => {
  if (!loc) return {};
  const [lat, lon] = loc.split(',');
  const latitude = Number.parseFloat(lat);
  const longitude = Number.parseFloat(lon);
  if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
    return { latitude, longitude };
  }
  return {};
};

const fetchWithTimeout = async (url: string, timeoutMs: number): Promise<Response> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { signal: controller.signal });
    return response;
  } finally {
    clearTimeout(timeout);
  }
};

const toGeoLookupValue = (raw: IpInfoRawResponse): GeoLookupValue => {
  const { latitude, longitude } = extractLatLong(raw.loc);
  return {
    ip: raw.ip,
    city: raw.city,
    region: raw.region,
    country: raw.country,
    latitude,
    longitude,
  };
};

export const resolveClientIp = (req: Pick<Request, 'ip' | 'headers' | 'socket'>): string => {
  const forwardedFor = req.headers['x-forwarded-for'];
  const forwardedValue = Array.isArray(forwardedFor)
    ? forwardedFor[0]
    : typeof forwardedFor === 'string'
      ? forwardedFor
      : undefined;
  const candidate = getNormalizedIp(forwardedValue);

  if (candidate) {
    return candidate;
  }

  if (req.socket?.remoteAddress) {
    return getNormalizedIp(req.socket.remoteAddress);
  }

  return getNormalizedIp(req.ip);
};

export const lookupIp = async (ipAddress: string): Promise<GeoLookupResult | null> => {
  const ip = getNormalizedIp(ipAddress);

  if (!ip || !isPublicIp(ip)) {
    return null;
  }

  const token = process.env.IPINFO_TOKEN;
  if (!token) {
    return null;
  }

  const cacheKey = getCacheKey(ip);
  const now = Date.now();
  const cached = cache.get(cacheKey);
  if (cached && cached.expiresAt > now) {
    return {
      ...cached.value,
      source: 'ipinfo',
      cached: true,
    };
  }

  const timeoutMs = getTimeout();
  const url = `${IPINFO_BASE_URL}/${encodeURIComponent(ip)}?token=${encodeURIComponent(token)}`;

  try {
    const response = await fetchWithTimeout(url, timeoutMs);

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as IpInfoRawResponse;

    if (!payload?.ip) {
      return null;
    }

    const value = toGeoLookupValue(payload);
    cache.set(cacheKey, {
      expiresAt: now + getCacheTtl(),
      value,
    });

    return {
      ...value,
      source: 'ipinfo',
      cached: false,
    };
  } catch (error) {
    if ((error as Error).name !== 'AbortError') {
      console.warn('Failed to lookup IP info', error);
    }

    return null;
  }
};

export const clearIpInfoCache = (): void => {
  cache.clear();
};

export const setIpInfoCache = (ip: string, value: GeoLookupValue, ttlMs: number): void => {
  cache.set(getCacheKey(ip), {
    value,
    expiresAt: Date.now() + ttlMs,
  });
};

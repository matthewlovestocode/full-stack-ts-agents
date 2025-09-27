import { describe, expect, it, vi } from 'vitest';
import type { Request, Response } from 'express';
import { healthHandler } from './index';

type MockResponse = Pick<Response, 'status' | 'json'> & {
  statusCode?: number;
  payload?: unknown;
};

const createMockResponse = (): MockResponse => {
  const res: MockResponse = {
    status: vi.fn(function status(this: MockResponse, code: number) {
      this.statusCode = code;
      return this;
    }) as MockResponse['status'],
    json: vi.fn(function json(this: MockResponse, payload: unknown) {
      this.payload = payload;
      this.statusCode = this.statusCode ?? 200;
      return this;
    }) as MockResponse['json'],
  };

  return res;
};

describe('healthHandler', () => {
  it('returns an ok payload with a 200 status', () => {
    const res = createMockResponse();

    healthHandler({} as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ status: 'ok' });
    expect(res.statusCode).toBe(200);
    expect(res.payload).toEqual({ status: 'ok' });
  });
});

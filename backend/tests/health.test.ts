import request from 'supertest';
import { describe, it, expect, vi } from 'vitest';
import app from '../src/app';

// Mock Supabase to avoid real network calls during tests
vi.mock('../src/config/supabase', () => ({
  getAdminSupabaseClient: vi.fn(() => ({
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    limit: vi.fn().mockResolvedValue({ data: [{ id: '123' }], error: null }),
  })),
}));

describe('Health Routes', () => {
  it('GET /api/v1/health should return ok', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('ok');
    expect(res.headers['x-request-id']).toBeDefined();
  });

  it('GET /api/v1/health/ready should return ready', async () => {
    const res = await request(app).get('/api/v1/health/ready');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('ready');
  });

  it('GET /unknown-route should return 404', async () => {
    const res = await request(app).get('/unknown-route');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });
});

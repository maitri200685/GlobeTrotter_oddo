import request from 'supertest';
import { describe, it, expect, vi } from 'vitest';
import app from '../src/app';

vi.mock('../src/config/supabase', () => ({
  getAuthSupabaseClient: vi.fn(() => ({
    from: vi.fn((table) => {
      return {
        select: vi.fn().mockReturnThis(),
        ilike: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: { id: 'item-1', name: 'Mock Item' },
          error: null
        }),
        then: vi.fn((cb) => cb({
          data: [{ id: 'item-1', name: 'Mock Item' }],
          error: null
        })),
      };
    })
  }))
}));

describe.skip('Data Discovery APIs', () => {
  it('should search cities', async () => {
    const res = await request(app)
      .get('/api/v1/cities/search?q=goa')
      .set('Authorization', 'Bearer valid-token');
      
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].name).toBe('Mock Item');
  });

  it('should get hotels for a city', async () => {
    const res = await request(app)
      .get('/api/v1/hotels?cityId=123e4567-e89b-12d3-a456-426614174000')
      .set('Authorization', 'Bearer valid-token');
      
    expect(res.status).toBe(200);
  });

  it('should get activities for a city', async () => {
    const res = await request(app)
      .get('/api/v1/activities?cityId=123e4567-e89b-12d3-a456-426614174000')
      .set('Authorization', 'Bearer valid-token');
      
    expect(res.status).toBe(200);
  });
});

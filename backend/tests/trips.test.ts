import request from 'supertest';
import { describe, it, expect, vi } from 'vitest';
import app from '../src/app';

vi.mock('../src/config/supabase', () => ({
  getAuthSupabaseClient: vi.fn(() => ({
    from: vi.fn((table) => {
      if (table === 'trips') {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          order: vi.fn().mockReturnThis(),
          limit: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValue({
            data: { id: 'trip-1', title: 'Test Trip', owner_id: 'user-1' },
            error: null
          }),
          then: vi.fn((cb) => cb({
            data: [{ id: 'trip-1', title: 'Test Trip', owner_id: 'user-1' }],
            error: null
          })),
          insert: vi.fn().mockReturnThis(),
          update: vi.fn().mockReturnThis(),
          delete: vi.fn().mockReturnThis()
        };
      }
    })
  }))
}));

describe.skip('Trips API', () => {
  it('should get all trips', async () => {
    const res = await request(app)
      .get('/api/v1/trips')
      .set('Authorization', 'Bearer valid-token');
      
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].id).toBe('trip-1');
  });

  it('should get a single trip', async () => {
    const res = await request(app)
      .get('/api/v1/trips/trip-1')
      .set('Authorization', 'Bearer valid-token');
      
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe('trip-1');
  });

  it('should fail to create a trip with invalid dates', async () => {
    const res = await request(app)
      .post('/api/v1/trips')
      .set('Authorization', 'Bearer valid-token')
      .send({
        title: 'New Trip',
        start_date: '2024-01-10',
        end_date: '2024-01-05', // end before start
      });
      
    expect(res.status).toBe(400); // Validation error
  });
});

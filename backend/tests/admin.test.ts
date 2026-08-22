import request from 'supertest';
import { describe, it, expect, vi } from 'vitest';
import app from '../src/app';

vi.mock('../src/config/supabase', () => ({
  getAuthSupabaseClient: vi.fn(() => ({
    from: vi.fn((table) => {
      if (table === 'profiles') {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValue({
            data: { role: 'admin' },
            error: null
          })
        };
      }
    })
  })),
  getAdminSupabaseClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: 'admin-1' } },
        error: null
      })
    },
    from: vi.fn((table) => {
      return {
        select: vi.fn().mockResolvedValue({
          data: [],
          count: 42,
          error: null
        })
      };
    })
  }))
}));

describe('Admin API', () => {
  it('should get analytics overview for admin', async () => {
    const res = await request(app)
      .get('/api/v1/admin/analytics/overview')
      .set('Authorization', 'Bearer valid-admin-token');
      
    expect(res.status).toBe(200);
    expect(res.body.data.totalUsers).toBe(42);
    expect(res.body.data.activeTrips).toBe(42);
  });
});

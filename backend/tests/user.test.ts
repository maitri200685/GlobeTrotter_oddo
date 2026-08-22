import request from 'supertest';
import { describe, it, expect, vi } from 'vitest';
import app from '../src/app';

vi.mock('../src/config/supabase', () => ({
  getAuthSupabaseClient: vi.fn(() => ({
    from: vi.fn((table) => {
      if (table === 'user_preferences') {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          upsert: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValue({
            data: {
              user_id: 'user-1',
              preferred_currency: 'EUR',
              travel_style: 'luxury'
            },
            error: null
          })
        };
      }
    })
  })),
  getAdminSupabaseClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: 'user-1' } },
        error: null
      })
    }
  }))
}));

describe('User Preferences API', () => {
  it('should get user preferences', async () => {
    const res = await request(app)
      .get('/api/v1/users/me/preferences')
      .set('Authorization', 'Bearer valid-token');
      
    expect(res.status).toBe(200);
    expect(res.body.data.preferred_currency).toBe('EUR');
    expect(res.body.data.travel_style).toBe('luxury');
  });

  it('should update user preferences', async () => {
    const res = await request(app)
      .patch('/api/v1/users/me/preferences')
      .set('Authorization', 'Bearer valid-token')
      .send({ preferred_currency: 'GBP' });
      
    expect(res.status).toBe(200);
    expect(res.body.data.preferred_currency).toBe('EUR'); // Mock returns static
  });
});

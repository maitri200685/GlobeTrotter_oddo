import request from 'supertest';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import app from '../src/app';

// Mock Supabase
vi.mock('../src/config/supabase', () => {
  return {
    getAuthSupabaseClient: vi.fn(() => ({
      from: vi.fn((table) => {
        if (table === 'trips') {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            update: vi.fn().mockReturnThis(),
            insert: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({
              data: {
                id: '123e4567-e89b-12d3-a456-426614174000',
                visibility: 'public',
                created_at: '2024-01-01T00:00:00Z',
                owner_id: 'user-1',
                title: 'Goa Trip'
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
  };
});

describe('Share API', () => {
  it('should return share meta for a trip', async () => {
    const res = await request(app)
      .get('/api/v1/trips/123e4567-e89b-12d3-a456-426614174000/share')
      .set('Authorization', 'Bearer valid-token');
      
    expect(res.status).toBe(200);
    expect(res.body.data.shareId).toBe('123e4567-e89b-12d3-a456-426614174000');
    expect(res.body.data.privacy).toBe('public');
  });

  it('should clone a shared trip', async () => {
    const res = await request(app)
      .post('/api/v1/share/123e4567-e89b-12d3-a456-426614174000/clone')
      .set('Authorization', 'Bearer valid-token');
      
    expect(res.status).toBe(200);
    expect(res.body.data.tripId).toBe('123e4567-e89b-12d3-a456-426614174000'); // Mocked insert return
  });
});

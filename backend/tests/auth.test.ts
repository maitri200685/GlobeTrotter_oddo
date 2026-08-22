import request from 'supertest';
import { describe, it, expect, vi } from 'vitest';
import app from '../src/app';

// Mock the getAdminSupabaseClient so we can control auth results
vi.mock('../src/config/supabase', () => {
  return {
    getAdminSupabaseClient: vi.fn(() => ({
      auth: {
        getUser: vi.fn(async (token: string) => {
          if (token === 'valid-token') {
            return {
              data: {
                user: {
                  id: 'user-123',
                  email: 'test@example.com',
                },
              },
              error: null,
            };
          }
          return { data: { user: null }, error: new Error('Invalid token') };
        }),
      },
    })),
  };
});

describe('Auth Middleware', () => {
  it('should return 401 if no Authorization header is present', async () => {
    const res = await request(app).get('/api/v1/auth/me');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.message).toBe('Missing Authorization header');
  });

  it('should return 401 if token is invalid', async () => {
    const res = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', 'Bearer invalid-token');
    
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.message).toBe('Invalid or expired token');
  });

  it('should return 200 and user data if token is valid', async () => {
    const res = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', 'Bearer valid-token');
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.id).toBe('user-123');
    expect(res.body.data.user.email).toBe('test@example.com');
  });
});

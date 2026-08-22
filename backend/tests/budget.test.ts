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
            single: vi.fn().mockResolvedValue({
              data: { id: '123e4567-e89b-12d3-a456-426614174000', total_budget: 1000 },
              error: null
            })
          };
        }
        if (table === 'expenses') {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            then: vi.fn((cb) => cb({
              data: [
                { amount: 100, category: 'transport' },
                { amount: 50, category: 'food' }
              ],
              error: null
            })),
            insert: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({
              data: { id: 'exp-1', amount: 100, category: 'transport' },
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

describe('Budget API', () => {
  it('should return budget summary', async () => {
    const res = await request(app)
      .get('/api/v1/trips/123e4567-e89b-12d3-a456-426614174000/budget')
      .set('Authorization', 'Bearer valid-token');
      
    expect(res.status).toBe(200);
    expect(res.body.data.targetBudget).toBe(1000);
    expect(res.body.data.totalEstimatedCost).toBe(150);
    expect(res.body.data.categories.transport).toBe(100);
    expect(res.body.data.categories.food).toBe(50);
    expect(res.body.data.status).toBe('healthy');
  });

  it('should add an expense', async () => {
    const res = await request(app)
      .post('/api/v1/trips/123e4567-e89b-12d3-a456-426614174000/budget/items')
      .set('Authorization', 'Bearer valid-token')
      .send({
        category: 'transport',
        amount: 100
      });
      
    expect(res.status).toBe(201);
    expect(res.body.data.id).toBe('exp-1');
  });

  it('should fail to add expense with negative amount', async () => {
    const res = await request(app)
      .post('/api/v1/trips/123e4567-e89b-12d3-a456-426614174000/budget/items')
      .set('Authorization', 'Bearer valid-token')
      .send({
        category: 'transport',
        amount: -50
      });
      
    expect(res.status).toBe(400); // Zod validation fails
  });
});

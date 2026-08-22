import { describe, it, expect } from 'vitest';
import request from 'supertest';
import express from 'express';
import { z } from 'zod';
import { validateRequest } from '../src/middleware/validation.middleware';
import { errorHandler } from '../src/middleware/error.middleware';

const app = express();
app.use(express.json());

const schema = z.object({
  body: z.object({
    name: z.string().min(3),
    age: z.number().int().positive(),
  }),
});

app.post('/test', validateRequest(schema), (req, res) => {
  res.json({ success: true, data: req.body });
});

app.use(errorHandler);

describe('Validation Middleware', () => {
  it('should pass if validation succeeds', async () => {
    const res = await request(app)
      .post('/test')
      .send({ name: 'John Doe', age: 30 });
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('should fail with 400 if validation fails', async () => {
    const res = await request(app)
      .post('/test')
      .send({ name: 'Jo', age: -5 });
    
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
    expect(res.body.error.details).toBeDefined();
  });
});

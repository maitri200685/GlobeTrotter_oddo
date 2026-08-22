import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import { env } from './config/env';
import { logger } from './utils/logger';
import { requestIdMiddleware } from './middleware/request-id.middleware';
import { errorHandler } from './middleware/error.middleware';
import { notFoundHandler } from './middleware/not-found.middleware';
import routes from './routes';

const app = express();

// Security Middlewares
app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN.split(',').map((o) => o.trim()),
    credentials: true,
  })
);

// Body Parsing
app.use(express.json({ limit: '10kb' })); // Limit body size

// Request ID
app.use(requestIdMiddleware);

// Logging
app.use(
  pinoHttp({
    logger,
    customProps: (req) => ({
      reqId: req.id || (req as any).reqId,
    }),
  })
);

// API Routes
app.use('/api/v1', routes);

// 404 Handler
app.use(notFoundHandler);

// Centralized Error Handler
app.use(errorHandler);

export default app;

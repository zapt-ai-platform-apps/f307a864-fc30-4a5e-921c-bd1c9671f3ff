import { jokes } from '../drizzle/schema.js';
import * as Sentry from "@sentry/node";
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';

Sentry.init({
  dsn: process.env.VITE_PUBLIC_SENTRY_DSN,
  environment: process.env.VITE_PUBLIC_APP_ENV,
  initialScope: {
    tags: {
      type: 'backend',
      projectId: process.env.PROJECT_ID
    }
  }
});

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ error: 'Missing Authorization header' });
      return;
    }

    const token = authHeader.split(' ')[1];
    // The token is the activation code
    const userId = token;

    const sql = neon(process.env.NEON_DB_URL);
    const db = drizzle(sql);

    const result = await db.select()
      .from(jokes)
      .where(eq(jokes.userId, userId))
      .limit(10);

    res.status(200).json(result);
  } catch (error) {
    Sentry.captureException(error);
    console.error('Error:', error);
    res.status(500).json({ error: 'Error fetching jokes' });
  }
}
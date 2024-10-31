import { jokes } from '../drizzle/schema.js';
import * as Sentry from "@sentry/node";
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

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
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
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

    const { setup, punchline } = req.body;

    if (!setup || !punchline) {
      return res.status(400).json({ error: 'Setup and punchline are required' });
    }

    const sql = neon(process.env.NEON_DB_URL);
    const db = drizzle(sql);

    const result = await db.insert(jokes).values({
      setup,
      punchline,
      userId: userId
    }).returning();

    res.status(201).json(result[0]);
  } catch (error) {
    Sentry.captureException(error);
    console.error('Error saving joke:', error);
    res.status(500).json({ error: 'Error saving joke' });
  }
}
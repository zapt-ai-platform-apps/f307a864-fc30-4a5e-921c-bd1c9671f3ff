import * as Sentry from "@sentry/node";

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

const validActivationCodes = ['ABC123', 'DEF456', 'GHI789']; // Replace with your actual activation codes

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  try {
    const { activationCode } = req.body;
    if (!activationCode) {
      res.status(400).json({ error: 'Activation code is required' });
      return;
    }

    if (!validActivationCodes.includes(activationCode)) {
      res.status(401).json({ error: 'Invalid activation code' });
      return;
    }

    // Simulate user object creation or retrieval
    const user = {
      id: activationCode,
      token: activationCode, // In a real app, generate a proper token
    };

    res.status(200).json({ user });
  } catch (error) {
    Sentry.captureException(error);
    console.error('Error validating activation code:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
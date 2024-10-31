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

// Replace this with your actual activation code validation logic
const validActivationCodes = ['ABC123', 'DEF456', 'GHI789'];

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

    // Create a user object or retrieve from database
    const user = {
      id: activationCode,
      token: activationCode, // In this example, the activation code serves as the token
    };

    res.status(200).json({ user });
  } catch (error) {
    Sentry.captureException(error);
    console.error('Error validating activation code:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
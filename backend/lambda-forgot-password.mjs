export const handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS' || event.requestContext?.http?.method === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'OK' })
    };
  }

  let client;
  try {
    const pg = await import('pg');
    const { Client } = pg.default || pg;

    const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    const { email } = body;

    if (!email) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Email is required' })
      };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid email format' })
      };
    }

    client = new Client({
      host: process.env.DB_HOST,
      port: 5432,
      database: 'kirudb',
      user: 'postgres',
      password: process.env.DB_PASSWORD,
      ssl: {
        rejectUnauthorized: false
      }
    });

    await client.connect();

    // Check if user exists
    const checkQuery = 'SELECT id, name FROM users WHERE email = $1';
    const checkResult = await client.query(checkQuery, [email]);

    if (checkResult.rows.length === 0) {
      // Don't reveal if email exists or not for security
      await client.end();
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          message: 'If an account exists with this email, you will receive reset instructions' 
        })
      };
    }

    // Generate temporary password (8 characters)
    const crypto = await import('crypto');
    const tempPassword = crypto.randomBytes(4).toString('hex');
    const hashedPassword = crypto.createHash('sha256').update(tempPassword).digest('hex');

    // Update password in database
    const updateQuery = 'UPDATE users SET password_hash = $1 WHERE email = $2';
    await client.query(updateQuery, [hashedPassword, email]);

    await client.end();

    // In production, you would send an email here with the temporary password
    // For now, we'll just log it (in production, use SES or similar service)
    console.log(`Temporary password for ${email}: ${tempPassword}`);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        message: 'Password reset instructions sent to your email',
        // REMOVE THIS IN PRODUCTION - only for demo purposes
        tempPassword: tempPassword
      })
    };

  } catch (error) {
    console.error('Forgot password error:', error);
    if (client) {
      try {
        await client.end();
      } catch (e) {
        console.error('Error closing client:', e);
      }
    }
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to process password reset',
        details: error.message 
      })
    };
  }
};

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
    const { userId, messages, topic } = body;

    if (!userId || !messages) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'userId and messages are required' })
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

    // Create conversations table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS conversations (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        topic VARCHAR(255),
        messages JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Insert conversation
    const insertQuery = `
      INSERT INTO conversations (user_id, topic, messages, created_at, updated_at)
      VALUES ($1, $2, $3::jsonb, NOW(), NOW())
      RETURNING id
    `;
    
    const result = await client.query(insertQuery, [
      userId,
      topic || 'General',
      JSON.stringify(messages)
    ]);

    await client.end();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'Conversation saved successfully',
        conversationId: result.rows[0].id
      })
    };

  } catch (error) {
    console.error('Save conversation error:', error);
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
        error: 'Failed to save conversation',
        details: error.message
      })
    };
  }
};

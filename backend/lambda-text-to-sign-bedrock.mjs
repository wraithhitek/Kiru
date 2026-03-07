// Lambda function: kiru-text-to-sign
// Uses AWS Bedrock to convert text to sign language instructions

import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

export const handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Allow-Methods': 'POST,OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS' || event.requestContext?.http?.method === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'OK' })
    };
  }

  try {
    const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    const { text } = body;

    if (!text) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Text is required' })
      };
    }

    console.log('Converting text to sign language:', text);

    // Initialize Bedrock client
    const client = new BedrockRuntimeClient({ 
      region: process.env.AWS_REGION || 'us-east-1' 
    });

    // Create prompt for sign language conversion
    const prompt = `You are an American Sign Language (ASL) expert. Convert the following text into ASL sign instructions.

For each word or phrase, provide a JSON object with:
- word: the word/phrase
- sign: name of the sign
- handShape: description of hand shape
- movement: description of movement
- location: where hands should be positioned
- duration: time in milliseconds to hold the sign

Text to convert: "${text}"

Respond with ONLY a JSON array, no other text. Example format:
[
  {
    "word": "hello",
    "sign": "HELLO",
    "handShape": "open hand",
    "movement": "wave near face",
    "location": "near face",
    "duration": 1000
  }
]`;

    // Invoke Bedrock model - Using Claude 3.5 Sonnet (latest)
    const command = new InvokeModelCommand({
      modelId: "anthropic.claude-3-5-sonnet-20241022-v2:0",
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 2000,
        temperature: 0.5,
        messages: [{
          role: "user",
          content: prompt
        }]
      })
    });

    const response = await client.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    
    // Extract the sign instructions from Claude's response
    let signInstructions;
    try {
      const content = responseBody.content[0].text;
      // Try to parse JSON from the response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        signInstructions = JSON.parse(jsonMatch[0]);
      } else {
        signInstructions = JSON.parse(content);
      }
    } catch (parseError) {
      console.error('Error parsing sign instructions:', parseError);
      // Fallback: create basic sign instructions
      signInstructions = text.split(' ').map((word, index) => ({
        word: word,
        sign: word.toUpperCase(),
        handShape: "varies",
        movement: "varies",
        location: "varies",
        duration: 1000
      }));
    }

    console.log('Sign instructions generated:', signInstructions.length, 'signs');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        text: text,
        signInstructions: signInstructions,
        totalDuration: signInstructions.reduce((sum, sign) => sum + sign.duration, 0),
        timestamp: Date.now()
      })
    };

  } catch (error) {
    console.error('Error converting to sign language:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to convert to sign language',
        details: error.message
      })
    };
  }
};

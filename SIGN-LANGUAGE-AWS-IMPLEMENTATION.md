# Sign Language Implementation with AWS

## Overview
This guide shows how to implement sign language translation for text content using AWS services.

## Architecture

```
Text Content → AWS Lambda → AI Model (Bedrock/SageMaker) → Sign Language Instructions → 3D Avatar Animation
```

---

## Option 1: Using AWS Bedrock + Custom Avatar (Recommended)

### Step 1: Create Lambda Function for Text-to-Sign Translation

```javascript
// Lambda: kiru-text-to-sign
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

export const handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST,OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const { text } = JSON.parse(event.body);
    
    const client = new BedrockRuntimeClient({ region: 'us-east-1' });
    
    const prompt = `You are a sign language expert. Convert the following text to American Sign Language (ASL) instructions.
    
For each word or phrase, provide:
1. The sign name
2. Hand shape
3. Movement direction
4. Location (where hands should be)
5. Timing (in milliseconds)

Format as JSON array.

Text: "${text}"

Respond with only the JSON array, no other text.`;

    const command = new InvokeModelCommand({
      modelId: "anthropic.claude-3-sonnet-20240229-v1:0",
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 2000,
        messages: [{
          role: "user",
          content: prompt
        }]
      })
    });

    const response = await client.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    const signInstructions = responseBody.content[0].text;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        text: text,
        signInstructions: JSON.parse(signInstructions),
        timestamp: Date.now()
      })
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};
```

### Step 2: Add IAM Permissions

Add to Lambda execution role:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeModel"
      ],
      "Resource": "arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-3-sonnet-20240229-v1:0"
    }
  ]
}
```

### Step 3: Install AWS SDK

```bash
# In Lambda layer or function
npm install @aws-sdk/client-bedrock-runtime
```

### Step 4: Frontend Integration

```typescript
// src/app/utils/signLanguage.ts
export interface SignInstruction {
  sign: string;
  handShape: string;
  movement: string;
  location: string;
  duration: number;
}

export const getSignLanguageInstructions = async (text: string): Promise<SignInstruction[]> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/text-to-sign`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text })
    });

    const data = await response.json();
    return data.signInstructions;
  } catch (error) {
    console.error('Error getting sign language:', error);
    return [];
  }
};
```

---

## Option 2: Using AWS Polly + Sign Language Database

### Step 1: Create Sign Language Database in DynamoDB

```javascript
// Lambda: kiru-create-sign-db
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

const signDatabase = {
  "hello": {
    animation: "wave_hand",
    duration: 1000,
    description: "Wave hand near face"
  },
  "thank you": {
    animation: "touch_chin_forward",
    duration: 1500,
    description: "Touch chin and move hand forward"
  },
  // Add more signs...
};

export const handler = async () => {
  const client = new DynamoDBClient({ region: 'ap-southeast-2' });
  
  for (const [word, data] of Object.entries(signDatabase)) {
    await client.send(new PutItemCommand({
      TableName: 'SignLanguageDatabase',
      Item: {
        word: { S: word },
        animation: { S: data.animation },
        duration: { N: data.duration.toString() },
        description: { S: data.description }
      }
    }));
  }
  
  return { statusCode: 200, body: 'Database created' };
};
```

### Step 2: Query Signs Lambda

```javascript
// Lambda: kiru-get-signs
import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";

export const handler = async (event) => {
  const { text } = JSON.parse(event.body);
  const words = text.toLowerCase().split(' ');
  
  const client = new DynamoDBClient({ region: 'ap-southeast-2' });
  const signs = [];
  
  for (const word of words) {
    const result = await client.send(new GetItemCommand({
      TableName: 'SignLanguageDatabase',
      Key: { word: { S: word } }
    }));
    
    if (result.Item) {
      signs.push({
        word: word,
        animation: result.Item.animation.S,
        duration: parseInt(result.Item.duration.N)
      });
    }
  }
  
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ signs })
  };
};
```

---

## Option 3: Using AWS SageMaker with Pre-trained Model

### Step 1: Deploy Sign Language Model

```python
# deploy_model.py
import boto3
import sagemaker

sagemaker_client = boto3.client('sagemaker')

# Use a pre-trained sign language model
model_data = 's3://your-bucket/sign-language-model.tar.gz'

response = sagemaker_client.create_model(
    ModelName='sign-language-translator',
    PrimaryContainer={
        'Image': '763104351884.dkr.ecr.us-east-1.amazonaws.com/pytorch-inference:1.12-cpu-py38',
        'ModelDataUrl': model_data
    },
    ExecutionRoleArn='arn:aws:iam::YOUR_ACCOUNT:role/SageMakerRole'
)
```

### Step 2: Create Endpoint

```python
# Create endpoint configuration
sagemaker_client.create_endpoint_config(
    EndpointConfigName='sign-language-config',
    ProductionVariants=[{
        'VariantName': 'AllTraffic',
        'ModelName': 'sign-language-translator',
        'InstanceType': 'ml.t2.medium',
        'InitialInstanceCount': 1
    }]
)

# Create endpoint
sagemaker_client.create_endpoint(
    EndpointName='sign-language-endpoint',
    EndpointConfigName='sign-language-config'
)
```

### Step 3: Lambda to Invoke Endpoint

```javascript
// Lambda: kiru-sagemaker-sign
import { SageMakerRuntimeClient, InvokeEndpointCommand } from "@aws-sdk/client-sagemaker-runtime";

export const handler = async (event) => {
  const { text } = JSON.parse(event.body);
  
  const client = new SageMakerRuntimeClient({ region: 'us-east-1' });
  
  const command = new InvokeEndpointCommand({
    EndpointName: 'sign-language-endpoint',
    ContentType: 'application/json',
    Body: JSON.stringify({ text: text })
  });
  
  const response = await client.send(command);
  const result = JSON.parse(new TextDecoder().decode(response.Body));
  
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(result)
  };
};
```

---

## Frontend: 3D Avatar Component

```typescript
// src/app/components/SignLanguageAvatar.tsx
import { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';

interface SignLanguageAvatarProps {
  text: string;
  isEnabled: boolean;
}

export const SignLanguageAvatar: React.FC<SignLanguageAvatarProps> = ({ text, isEnabled }) => {
  const [signs, setSigns] = useState<any[]>([]);
  const [currentSign, setCurrentSign] = useState(0);

  useEffect(() => {
    if (!isEnabled || !text) return;

    const fetchSigns = async () => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/text-to-sign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      
      const data = await response.json();
      setSigns(data.signInstructions);
    };

    fetchSigns();
  }, [text, isEnabled]);

  useEffect(() => {
    if (signs.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSign((prev) => (prev + 1) % signs.length);
    }, signs[currentSign]?.duration || 1000);

    return () => clearInterval(interval);
  }, [signs, currentSign]);

  if (!isEnabled) return null;

  return (
    <div className="w-full h-full bg-black/20 rounded-xl">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Avatar animation={signs[currentSign]?.sign} />
      </Canvas>
      
      {signs[currentSign] && (
        <div className="absolute bottom-2 left-2 right-2 bg-black/60 text-white text-sm p-2 rounded">
          {signs[currentSign].sign}
        </div>
      )}
    </div>
  );
};

function Avatar({ animation }: { animation: string }) {
  const { scene, animations } = useGLTF('/models/sign-avatar.glb');
  const { actions } = useAnimations(animations, scene);

  useEffect(() => {
    if (animation && actions[animation]) {
      actions[animation]?.reset().play();
    }
  }, [animation, actions]);

  return <primitive object={scene} />;
}
```

---

## Cost Estimates

| Service | Usage | Monthly Cost |
|---------|-------|--------------|
| AWS Bedrock (Claude) | 1M tokens | ~$3-8 |
| Lambda | 1M requests | ~$0.20 |
| DynamoDB | 1GB storage | ~$0.25 |
| API Gateway | 1M requests | ~$3.50 |
| SageMaker (optional) | ml.t2.medium | ~$35/month |
| **Total (Bedrock)** | | **~$7-12/month** |
| **Total (SageMaker)** | | **~$40/month** |

---

## Setup Instructions

### 1. Create Lambda Functions

```bash
# Create text-to-sign Lambda
aws lambda create-function \
  --function-name kiru-text-to-sign \
  --runtime nodejs20.x \
  --role arn:aws:iam::YOUR_ACCOUNT:role/lambda-role \
  --handler index.handler \
  --zip-file fileb://function.zip
```

### 2. Add Environment Variables

```bash
aws lambda update-function-configuration \
  --function-name kiru-text-to-sign \
  --environment Variables={REGION=us-east-1}
```

### 3. Create API Gateway Route

```bash
# Add to your existing API Gateway
POST /api/text-to-sign → Lambda: kiru-text-to-sign
```

### 4. Install Frontend Dependencies

```bash
npm install @react-three/fiber @react-three/drei three
```

### 5. Update AccessibilityPanel

```typescript
// Enable sign language avatar
const [signLanguageEnabled, setSignLanguageEnabled] = useState(false);

// In the avatar section
{signLanguageEnabled && (
  <SignLanguageAvatar 
    text={currentText} 
    isEnabled={signLanguageEnabled} 
  />
)}
```

---

## Testing

```bash
# Test Lambda function
aws lambda invoke \
  --function-name kiru-text-to-sign \
  --payload '{"body":"{\"text\":\"Hello, how are you?\"}"}' \
  response.json

cat response.json
```

---

## Resources

- AWS Bedrock: https://aws.amazon.com/bedrock/
- AWS SageMaker: https://aws.amazon.com/sagemaker/
- Three.js: https://threejs.org/
- React Three Fiber: https://docs.pmnd.rs/react-three-fiber
- ASL Dictionary: https://www.handspeak.com/

---

## Next Steps

1. Create Lambda function with Bedrock
2. Set up API Gateway route
3. Install Three.js dependencies
4. Create 3D avatar model or use free models
5. Integrate with AccessibilityPanel
6. Test with real text
7. Add more sign language animations
8. Optimize performance

---

## Alternative: Use Existing Services

If you want a faster solution without building everything:

1. **SignTime API**: https://signtime.com/api
2. **SignVideo**: https://signvideo.com/developers
3. **Microsoft Translator**: Has sign language support

These are paid services but provide production-ready sign language translation.

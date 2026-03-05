# Accessibility Features - Sign Language Support

## Current Implementation

### ✅ Live Captions (Speech-to-Text)
- Real-time speech recognition using Web Speech API
- Adjustable font size
- Expandable/minimizable panel
- Works in Chrome and Edge browsers

### 🚧 Sign Language Avatar (Placeholder)
- UI placeholder ready for integration
- Awaiting sign language API integration

## Future Integration Options

### Option 1: SignTime API (Professional Service)
**Best for: Production-ready solution**

```javascript
// Example integration
import SignTimeSDK from 'signtime-sdk';

const signTime = new SignTimeSDK({
  apiKey: process.env.SIGNTIME_API_KEY
});

// Convert text to sign language
const signLanguageVideo = await signTime.textToSign({
  text: currentCaption,
  language: 'ASL', // or 'BSL', 'ISL', etc.
  avatarStyle: 'realistic'
});
```

**Providers:**
- SignTime: https://signtime.com
- SignVideo: https://signvideo.com
- Purple: https://purple.com

**Cost:** ~$50-200/month for API access

---

### Option 2: Open Source Sign Language Generation
**Best for: Custom implementation**

#### A. Using SignWriting + Animation
```bash
npm install signwriting-animation
```

```javascript
import { SignWritingAnimator } from 'signwriting-animation';

const animator = new SignWritingAnimator({
  container: document.getElementById('sign-avatar'),
  language: 'ASL'
});

// Animate sign language
animator.animate(signWritingNotation);
```

#### B. Using Pose Estimation (MediaPipe)
```bash
npm install @mediapipe/holistic
```

```javascript
import { Holistic } from '@mediapipe/holistic';

const holistic = new Holistic({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
  }
});

// Generate sign language poses
holistic.onResults((results) => {
  // Render 3D avatar with poses
  renderAvatar(results.poseLandmarks);
});
```

---

### Option 3: AI-Powered Sign Language (Recommended for Kiru)
**Best for: Modern AI integration**

#### Using OpenAI + Sign Language Database

```javascript
// 1. Convert speech to text (already implemented)
const transcript = await speechToText(audioStream);

// 2. Get sign language instructions from AI
const signInstructions = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${OPENAI_API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'gpt-4',
    messages: [{
      role: 'system',
      content: 'Convert the following text to ASL sign language notation with timing'
    }, {
      role: 'user',
      content: transcript
    }]
  })
});

// 3. Animate avatar based on instructions
animateSignLanguageAvatar(signInstructions);
```

#### Using Groq (Already in your stack!)

```javascript
// Lambda function: kiru-text-to-sign
export const handler = async (event) => {
  const { text } = JSON.parse(event.body);
  
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{
        role: 'system',
        content: 'You are a sign language expert. Convert text to ASL sign language instructions with timing and hand positions.'
      }, {
        role: 'user',
        content: `Convert to ASL: ${text}`
      }]
    })
  });
  
  const data = await response.json();
  return {
    statusCode: 200,
    body: JSON.stringify({
      signInstructions: data.choices[0].message.content
    })
  };
};
```

---

### Option 4: 3D Avatar Libraries
**Best for: Visual quality**

#### A. Ready Player Me (Customizable Avatars)
```bash
npm install @readyplayerme/rpm-react
```

```javascript
import { Avatar } from '@readyplayerme/rpm-react';

<Avatar
  modelSrc="https://models.readyplayerme.com/your-avatar-id.glb"
  animationSrc={signLanguageAnimation}
  style={{ width: '100%', height: '100%' }}
/>
```

#### B. Three.js + Custom Avatar
```bash
npm install three @react-three/fiber @react-three/drei
```

```javascript
import { Canvas } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';

function SignLanguageAvatar({ animation }) {
  const { scene, animations } = useGLTF('/models/sign-avatar.glb');
  const { actions } = useAnimations(animations, scene);
  
  useEffect(() => {
    actions[animation]?.play();
  }, [animation]);
  
  return <primitive object={scene} />;
}

// Usage
<Canvas>
  <SignLanguageAvatar animation="hello" />
</Canvas>
```

---

## Implementation Roadmap

### Phase 1: Current (✅ Completed)
- [x] Live captions with Web Speech API
- [x] Adjustable text size
- [x] Floating accessibility button
- [x] Expandable panel UI

### Phase 2: Basic Sign Language (Recommended Next)
1. Create Lambda function for text-to-sign using Groq
2. Integrate simple 2D animated avatar
3. Map common words/phrases to sign animations
4. Test with Deaf/HoH users

### Phase 3: Advanced Features
1. 3D realistic avatar with Three.js
2. Multiple sign languages (ASL, BSL, ISL)
3. Customizable avatar appearance
4. Save user preferences
5. Offline mode with cached animations

### Phase 4: AI-Powered Real-Time
1. Real-time speech-to-sign translation
2. Context-aware signing
3. Facial expressions and emotions
4. Integration with video calls

---

## Quick Start Guide

### For Developers

1. **Enable accessibility features:**
   - Click the blue accessibility button (bottom-left)
   - Click "Start Listening" for live captions

2. **Test speech recognition:**
   - Speak clearly into your microphone
   - Captions appear in real-time
   - Adjust font size as needed

3. **Add sign language API (when ready):**
   ```javascript
   // In AccessibilityPanel.tsx
   const convertToSignLanguage = async (text: string) => {
     const response = await fetch(`${API_URL}/api/text-to-sign`, {
       method: 'POST',
       body: JSON.stringify({ text })
     });
     const { signInstructions } = await response.json();
     animateAvatar(signInstructions);
   };
   ```

---

## Resources

### Sign Language Databases
- ASL-LEX: https://asl-lex.org/
- SignBank: https://signbank.org/
- Spread The Sign: https://www.spreadthesign.com/

### APIs & Services
- SignTime: https://signtime.com/api
- SignVideo: https://signvideo.com/developers
- Microsoft Sign Language Translator: https://www.microsoft.com/translator

### Open Source Projects
- SignWriting: https://www.signwriting.org/
- OpenASL: https://github.com/sign-language-processing
- MediaPipe Holistic: https://google.github.io/mediapipe/solutions/holistic

### Research Papers
- "Sign Language Production using Neural Machine Translation"
- "Real-time Sign Language Recognition using Deep Learning"
- "3D Avatar Animation for Sign Language"

---

## Cost Estimates

| Solution | Setup Cost | Monthly Cost | Quality |
|----------|-----------|--------------|---------|
| Web Speech API (Current) | $0 | $0 | Good |
| SignTime API | $0 | $50-200 | Excellent |
| Custom AI + 3D Avatar | $500-2000 | $20-50 | Very Good |
| Open Source | $0 | $0 | Fair-Good |

---

## Accessibility Standards

This implementation follows:
- WCAG 2.1 Level AA guidelines
- Section 508 compliance
- ADA (Americans with Disabilities Act) requirements

---

## Support

For questions or contributions:
- GitHub Issues: [Your Repo]
- Email: [Your Email]
- Accessibility Feedback: [Feedback Form]

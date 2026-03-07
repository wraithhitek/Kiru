export const handler = async (event) => {
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    try {
        console.log('AI Tutor request received');
        
        const body = JSON.parse(event.body || '{}');
        const question = body.question;
        
        if (!question || typeof question !== 'string') {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ 
                    error: "Question is required and must be a string"
                })
            };
        }

        // Educational response for AI Tutor
        const educationalResponse = `🎯 **Problem Analysis**: You asked about "${question}"

This is a great programming question! Let me help you understand it step by step.

💡 **Simple Explanation**: 
Programming concepts can seem complex at first, but they become clearer when we break them down into smaller parts.

🔧 **Step-by-Step Approach**:
1. **Understand the basics** - Start with the fundamental concept
2. **See examples** - Look at simple, working code examples  
3. **Practice** - Try writing similar code yourself
4. **Experiment** - Modify examples to see what happens
5. **Build up** - Gradually work on more complex scenarios

💻 **Code Example**:
\`\`\`python
# Here's a simple example to get you started
def learn_programming():
    print("Step 1: Understand the problem")
    print("Step 2: Break it into smaller parts")
    print("Step 3: Solve each part")
    print("Step 4: Put it all together")
    return "Learning achieved!"

# Try this approach with your question
result = learn_programming()
print(result)
\`\`\`

🧠 **Check Your Understanding**:
- Can you explain the main concept in your own words?
- What part seems most challenging to you?
- How would you apply this to a real project?

🚀 **What's Next**:
- Practice with simple examples
- Ask more specific questions about parts you don't understand
- Try building something small using this concept
- Don't be afraid to experiment and make mistakes!

**Remember**: Every expert programmer started exactly where you are now. Keep asking questions and practicing! 🌟`;

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
                answer: educationalResponse,
                model: "Educational Response System",
                feature: "AI Tutor",
                timestamp: new Date().toISOString()
            })
        };

    } catch (error) {
        console.error('AI Tutor Error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: "Failed to get AI tutor response",
                details: error.message
            })
        };
    }
};
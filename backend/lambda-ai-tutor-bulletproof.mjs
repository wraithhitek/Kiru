export const handler = async (event) => {
    // CORS headers
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
    };

    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return { 
            statusCode: 200, 
            headers, 
            body: JSON.stringify({ message: 'CORS preflight successful' })
        };
    }

    try {
        console.log('=== LAMBDA START ===');
        console.log('Event:', JSON.stringify(event, null, 2));
        
        // Parse request body safely
        let requestBody;
        try {
            requestBody = JSON.parse(event.body || '{}');
            console.log('Parsed body:', requestBody);
        } catch (parseError) {
            console.error('Body parse error:', parseError);
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ 
                    error: "Invalid JSON in request body",
                    details: parseError.message 
                })
            };
        }

        const question = requestBody.question;
        console.log('Question received:', question);
        
        if (!question || typeof question !== 'string') {
            console.log('No valid question provided');
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ 
                    error: "Question is required and must be a string",
                    received: typeof question
                })
            };
        }

        // Create educational response
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

        console.log('Generated educational response, length:', educationalResponse.length);

        const response = {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
                answer: educationalResponse,
                model: "Educational Response System",
                feature: "AI Tutor",
                timestamp: new Date().toISOString(),
                questionLength: question.length
            })
        };

        console.log('=== LAMBDA SUCCESS ===');
        return response;

    } catch (error) {
        console.error('=== LAMBDA ERROR ===');
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: "Internal server error",
                message: "Something went wrong processing your request",
                timestamp: new Date().toISOString(),
                errorType: error.name || 'Unknown'
            })
        };
    }
};
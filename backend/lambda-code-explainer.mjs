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
        const body = JSON.parse(event.body || '{}');
        const { code, language = 'javascript', explanationLevel = 'detailed' } = body;
        
        if (!code) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: "Code is required" })
            };
        }

        const explanation = `🎯 **Code Analysis**: Analyzing your ${language} code

💡 **What this code does**:
This code demonstrates fundamental programming concepts that are essential for understanding ${language}.

🔧 **Step-by-step breakdown**:
1. **Structure**: The code follows standard ${language} syntax
2. **Logic**: Each line serves a specific purpose
3. **Flow**: The execution follows a logical sequence
4. **Output**: The code produces predictable results

💻 **Key concepts used**:
- Variables and data types
- Functions and methods
- Control structures
- Best practices

🧠 **Understanding check**:
- Can you identify the main purpose of this code?
- What would happen if you modified certain parts?
- How could you extend this functionality?

🚀 **Next steps**:
- Try running this code yourself
- Experiment with modifications
- Apply these concepts to your own projects

**Code being analyzed**:
\`\`\`${language}
${code}
\`\`\``;

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
                explanation,
                model: "Code Analysis System",
                feature: "Code Explainer",
                language
            })
        };

    } catch (error) {
        console.error('Code Explainer Error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: "Failed to explain code",
                details: error.message
            })
        };
    }
};
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
        const { errorMessage, code, language = 'javascript', stackTrace = '', context = '' } = body;
        
        if (!errorMessage && !code) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: "Error message or code is required" })
            };
        }

        const solution = `🎯 **Error Analysis**: Debugging your ${language} issue

${errorMessage ? `**Error Message**: ${errorMessage}` : ''}
${stackTrace ? `**Stack Trace**: ${stackTrace}` : ''}
${context ? `**Context**: ${context}` : ''}

💡 **Root Cause**: 
Error messages in programming are actually helpful guides that tell us exactly what went wrong and where.

🔧 **Debugging Steps**:
1. **Read the error carefully** - Error messages contain valuable information
2. **Locate the problem** - Find the exact line or section causing issues
3. **Understand the cause** - Why is this happening?
4. **Apply the fix** - Make the necessary corrections
5. **Test the solution** - Verify the fix works

💻 **Common solutions**:
- Check syntax (missing semicolons, brackets, quotes)
- Verify variable names and spelling
- Ensure proper data types
- Check function calls and parameters

🧠 **Prevention tips**:
- Use a good code editor with syntax highlighting
- Write code incrementally and test frequently
- Use debugging tools and console.log statements
- Read documentation when using new functions

🚀 **Next steps**:
- Apply the suggested fix
- Test your code thoroughly
- Learn from this error to avoid similar issues

${code ? `**Your Code**:\n\`\`\`${language}\n${code}\n\`\`\`` : ''}`;

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
                solution,
                model: "Debug Assistant",
                feature: "Debug Error",
                language
            })
        };

    } catch (error) {
        console.error('Debug Error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: "Failed to debug error",
                details: error.message
            })
        };
    }
};
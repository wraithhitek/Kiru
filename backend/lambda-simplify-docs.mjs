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
        const { documentText, simplificationLevel = 'medium' } = body;
        
        if (!documentText) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: "Document text is required" })
            };
        }

        const simplifiedText = `📄 **Simplified Documentation**

**Original concept**: ${documentText.substring(0, 200)}${documentText.length > 200 ? '...' : ''}

**Simple explanation**:
This documentation explains important concepts in an easy-to-understand way.

**Key points**:
- **Main idea**: The core concept being explained
- **How it works**: Step-by-step process
- **Why it matters**: Practical applications
- **What to remember**: Essential takeaways

**In simple terms**:
Think of this like a recipe or instruction manual. Just as a recipe breaks down cooking into simple steps, this concept works by following a logical sequence of actions.

**Quick summary**:
- ✅ **What it is**: The fundamental concept or tool
- ✅ **How to use it**: Practical steps to implement
- ✅ **When to apply it**: Best use cases and scenarios
- ✅ **Common mistakes to avoid**: Pitfalls and how to prevent them

**Simplified breakdown**:
1. **Start here**: Basic understanding of the concept
2. **Then do this**: First practical step
3. **Next step**: Building on the foundation
4. **Finally**: Advanced usage and optimization

**Real-world example**:
Imagine you're ${simplificationLevel === 'beginner' ? 'learning to ride a bike' : simplificationLevel === 'advanced' ? 'optimizing a complex system' : 'following a new process at work'}. This concept works similarly by providing structure and guidance.

**Next steps**:
1. Read through the simplified version
2. Try the examples provided
3. Practice with your own use cases
4. Ask questions if anything is unclear

**Remember**: Every expert started as a beginner. Take your time to understand each part before moving on!`;

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
                simplifiedText,
                model: "Document Simplifier",
                feature: "Simplify Docs",
                simplificationLevel,
                originalLength: documentText.length,
                simplifiedLength: simplifiedText.length
            })
        };

    } catch (error) {
        console.error('Simplify Docs Error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: "Failed to simplify document",
                details: error.message
            })
        };
    }
};
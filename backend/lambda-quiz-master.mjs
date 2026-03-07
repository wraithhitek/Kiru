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
        const { topic, difficulty = 'medium', questionCount = 5 } = body;
        
        if (!topic) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: "Topic is required" })
            };
        }

        // Generate sample questions based on topic
        const questions = Array.from({ length: questionCount }, (_, i) => {
            const questionNumber = i + 1;
            return {
                question: `What is an important concept in ${topic}? (Question ${questionNumber})`,
                options: [
                    `A) Correct answer about ${topic}`,
                    `B) Incorrect option 1`,
                    `C) Incorrect option 2`, 
                    `D) Incorrect option 3`
                ],
                correct: 0,
                explanation: `This is the correct answer because it demonstrates a fundamental concept in ${topic}.`
            };
        });

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
                questions,
                model: "Quiz Generator",
                feature: "Quiz Master",
                topic,
                difficulty,
                count: questions.length
            })
        };

    } catch (error) {
        console.error('Quiz Master Error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: "Failed to generate quiz questions",
                details: error.message
            })
        };
    }
};
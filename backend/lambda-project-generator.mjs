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
        const { projectType, technology = 'javascript', complexity = 'medium', features = [], description = '' } = body;
        
        if (!projectType) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: "Project type is required" })
            };
        }

        const project = `# ${projectType} Project - ${technology}

## 🎯 Project Overview
This ${projectType} project uses ${technology} and is designed for ${complexity} complexity level.

${description ? `**Description**: ${description}` : ''}
${features.length > 0 ? `**Features**: ${features.join(', ')}` : ''}

## 📁 Project Structure
\`\`\`
${projectType.toLowerCase()}-project/
├── src/
│   ├── index.${technology === 'javascript' ? 'js' : technology === 'python' ? 'py' : 'js'}
│   ├── components/
│   └── utils/
├── tests/
├── docs/
├── package.json
└── README.md
\`\`\`

## 🚀 Getting Started
1. Clone or create the project structure
2. Install dependencies
3. Run the development server
4. Start coding!

## 💻 Core Implementation
\`\`\`${technology}
${technology === 'javascript' ? `// Main application entry point
function main() {
    console.log("Welcome to your ${projectType} project!");
    // Add your implementation here
}

main();` : technology === 'python' ? `# Main application entry point
def main():
    print("Welcome to your ${projectType} project!")
    # Add your implementation here

if __name__ == "__main__":
    main()` : `// Main application entry point
function main() {
    console.log("Welcome to your ${projectType} project!");
    // Add your implementation here
}

main();`}
\`\`\`

## 🧪 Testing
\`\`\`${technology}
${technology === 'javascript' ? `// Example test
describe('${projectType}', () => {
    test('should work correctly', () => {
        expect(true).toBe(true);
    });
});` : technology === 'python' ? `# Example test
import unittest

class Test${projectType.replace(/\s+/g, '')}(unittest.TestCase):
    def test_basic_functionality(self):
        self.assertTrue(True)

if __name__ == '__main__':
    unittest.main()` : `// Example test
describe('${projectType}', () => {
    test('should work correctly', () => {
        expect(true).toBe(true);
    });
});`}
\`\`\`

## 🔧 Configuration
${technology === 'javascript' ? `\`\`\`json
{
  "name": "${projectType.toLowerCase()}-project",
  "version": "1.0.0",
  "description": "${description || `A ${projectType} project`}",
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js",
    "test": "jest",
    "dev": "nodemon src/index.js"
  }
}
\`\`\`` : technology === 'python' ? `\`\`\`
# requirements.txt
# Add your dependencies here
\`\`\`` : ''}

## 🧪 Next Steps
- Implement core functionality
- Add error handling
- Write comprehensive tests
- Set up CI/CD pipeline
- Deploy your project
- Add documentation

## 📚 Resources
- Official ${technology} documentation
- Best practices for ${projectType} projects
- Testing frameworks and tools
- Deployment guides`;

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
                project,
                model: "Project Generator",
                feature: "Project Generator",
                projectType,
                technology,
                complexity
            })
        };

    } catch (error) {
        console.error('Project Generator Error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: "Failed to generate project",
                details: error.message
            })
        };
    }
};
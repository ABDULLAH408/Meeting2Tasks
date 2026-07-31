# Meeting2Tasks

Turn messy meeting notes into actionable tasks in seconds using AI (Powered by Groq).

## Architecture

- **Frontend**: React 19, Vite, Tailwind CSS V4, Framer Motion, TanStack Query.
- **Backend**: Node.js, Express (Wrapped with `serverless-http` for AWS Lambda).
- **Database**: Amazon DynamoDB.
- **AI**: Groq API (Llama3).

## Prerequisites

- Node.js >= 18
- AWS Account (for DynamoDB and Lambda deployment)
- Groq API Key

## Local Development Setup

### 1. Database (DynamoDB)
You need to create two tables in DynamoDB (or use a local mock).
Refer to `docs/dynamodb-schema.json` for table schemas.

### 2. Backend
\`\`\`bash
cd backend
npm install
cp .env.example .env
# Edit .env and add your GROQ_API_KEY and correct AWS Region
npm run dev
\`\`\`
The backend runs on http://localhost:3000

### 3. Frontend
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`
The frontend runs on http://localhost:5173

## AWS Deployment

### Backend (AWS Lambda & API Gateway)
1. Build the backend: `npm run build`
2. You can use Serverless Framework or AWS SAM. 
   - A standard SAM template or Serverless `serverless.yml` can point the handler to `dist/lambda.handler`.
3. Set Environment variables in your Lambda function (`GROQ_API_KEY`, `DYNAMODB_MEETINGS_TABLE`, `DYNAMODB_TASKS_TABLE`).
4. Ensure the Lambda execution role has `dynamodb:PutItem`, `dynamodb:Scan`, `dynamodb:UpdateItem`, `dynamodb:DeleteItem` permissions on the respective tables.

### Frontend (AWS Amplify)
1. Connect your GitHub repository to AWS Amplify Hosting.
2. Set the build settings:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Output directory: `dist`
3. If you deployed your backend to API Gateway, update `API_BASE` in `frontend/src/lib/api.ts` before building.

## Environment Variables
- `GROQ_API_KEY` - API key from groq.com
- `GROQ_MODEL` - Default: `llama3-8b-8192`
- `AWS_REGION` - AWS region for DynamoDB
- `DYNAMODB_MEETINGS_TABLE` - Default: `Meeting2Tasks-Meetings`
- `DYNAMODB_TASKS_TABLE` - Default: `Meeting2Tasks-Tasks`

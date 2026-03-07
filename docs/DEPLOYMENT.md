# 🚀 Deployment Guide

## 📋 **Prerequisites**
- AWS Account with appropriate permissions
- AWS CLI configured
- Node.js 18+ installed
- PostgreSQL client (for database setup)

## 🗄️ **Database Setup**

### **1. Create RDS Instance**
```bash
aws rds create-db-instance \
  --db-instance-identifier kiru-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --engine-version 15.4 \
  --master-username postgres \
  --master-user-password YOUR_SECURE_PASSWORD \
  --allocated-storage 20 \
  --storage-type gp2 \
  --vpc-security-group-ids sg-xxxxxxxxx \
  --db-subnet-group-name default \
  --backup-retention-period 7 \
  --storage-encrypted
```

### **2. Initialize Database**
```bash
# Connect to your RDS instance
psql -h your-rds-endpoint.region.rds.amazonaws.com -U postgres -d postgres

# Create database
CREATE DATABASE kirudb;

# Connect to the new database
\c kirudb

# Run the schema
\i database/schema.sql
```

## ⚡ **Backend Deployment**

### **1. Create IAM Role**
```bash
aws iam create-role \
  --role-name kiru-lambda-role \
  --assume-role-policy-document '{
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Principal": {
          "Service": "lambda.amazonaws.com"
        },
        "Action": "sts:AssumeRole"
      }
    ]
  }'

# Attach policies
aws iam attach-role-policy \
  --role-name kiru-lambda-role \
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole

aws iam attach-role-policy \
  --role-name kiru-lambda-role \
  --policy-arn arn:aws:iam::aws:policy/AmazonRDSDataFullAccess

aws iam attach-role-policy \
  --role-name kiru-lambda-role \
  --policy-arn arn:aws:iam::aws:policy/AmazonBedrockFullAccess
```

### **2. Deploy Lambda Functions**
For each function in `backend/`:

```bash
# Create function
aws lambda create-function \
  --function-name kiru-ai-tutor \
  --runtime nodejs20.x \
  --role arn:aws:iam::YOUR-ACCOUNT:role/kiru-lambda-role \
  --handler index.handler \
  --zip-file fileb://function.zip \
  --timeout 60 \
  --memory-size 512 \
  --environment Variables='{
    "DB_HOST":"your-rds-endpoint.region.rds.amazonaws.com",
    "DB_PASSWORD":"your-secure-password",
    "DB_NAME":"kirudb",
    "DB_USER":"postgres",
    "AWS_REGION":"ap-southeast-2",
    "JWT_SECRET":"your-jwt-secret-key"
  }'
```

### **3. Create API Gateway**
```bash
# Create HTTP API
aws apigatewayv2 create-api \
  --name kiru-api \
  --protocol-type HTTP \
  --cors-configuration AllowOrigins="*",AllowMethods="GET,POST,PUT,DELETE,OPTIONS",AllowHeaders="Content-Type,Authorization"

# Create routes (repeat for each endpoint)
aws apigatewayv2 create-route \
  --api-id YOUR-API-ID \
  --route-key "POST /api/ai-tutor"

# Create integrations
aws apigatewayv2 create-integration \
  --api-id YOUR-API-ID \
  --integration-type AWS_PROXY \
  --integration-uri arn:aws:lambda:region:account:function:kiru-ai-tutor

# Deploy API
aws apigatewayv2 create-deployment \
  --api-id YOUR-API-ID \
  --stage-name prod
```

## 🌐 **Frontend Deployment**

### **1. Build Frontend**
```bash
cd Kiru-
npm install
npm run build
```

### **2. Deploy to S3 + CloudFront**
```bash
# Create S3 bucket
aws s3 mb s3://kiru-frontend-bucket

# Enable static website hosting
aws s3 website s3://kiru-frontend-bucket \
  --index-document index.html \
  --error-document index.html

# Upload build files
aws s3 sync dist/ s3://kiru-frontend-bucket --delete

# Create CloudFront distribution (optional)
aws cloudfront create-distribution \
  --distribution-config file://cloudfront-config.json
```

### **3. Alternative: Deploy to Netlify**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

## 🔧 **Environment Configuration**

### **Frontend (.env)**
```bash
VITE_API_URL=https://your-api-id.execute-api.ap-southeast-2.amazonaws.com
VITE_APP_NAME=Kiru AI Learning Platform
VITE_APP_VERSION=1.0.0
```

### **Backend (Lambda Environment Variables)**
```bash
DB_HOST=your-rds-endpoint.region.rds.amazonaws.com
DB_PORT=5432
DB_NAME=kirudb
DB_USER=postgres
DB_PASSWORD=your-secure-password
AWS_REGION=ap-southeast-2
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=production
```

## 📊 **Monitoring Setup**

### **1. CloudWatch Alarms**
```bash
# Lambda error alarm
aws cloudwatch put-metric-alarm \
  --alarm-name "Kiru-Lambda-Errors" \
  --alarm-description "Lambda function errors" \
  --metric-name Errors \
  --namespace AWS/Lambda \
  --statistic Sum \
  --period 300 \
  --threshold 5 \
  --comparison-operator GreaterThanThreshold

# RDS CPU alarm
aws cloudwatch put-metric-alarm \
  --alarm-name "Kiru-RDS-CPU" \
  --alarm-description "RDS CPU utilization" \
  --metric-name CPUUtilization \
  --namespace AWS/RDS \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold
```

### **2. Enable X-Ray Tracing**
```bash
aws lambda update-function-configuration \
  --function-name kiru-ai-tutor \
  --tracing-config Mode=Active
```

## 🔒 **Security Checklist**

- [ ] RDS instance in private subnet
- [ ] Security groups configured properly
- [ ] Environment variables encrypted
- [ ] API Gateway throttling enabled
- [ ] CloudFront with HTTPS only
- [ ] IAM roles with least privilege
- [ ] Database backups enabled
- [ ] SSL certificates configured

## 🧪 **Testing Deployment**

### **1. Test API Endpoints**
```bash
# Test AI Tutor
curl -X POST https://your-api-url/api/ai-tutor \
  -H "Content-Type: application/json" \
  -d '{"question": "What is a function in Python?"}'

# Test Code Explainer
curl -X POST https://your-api-url/api/code-explainer \
  -H "Content-Type: application/json" \
  -d '{"code": "def hello(): print(\"Hello\")", "language": "python"}'
```

### **2. Test Frontend**
1. Open your deployed frontend URL
2. Navigate to each feature
3. Test AI interactions
4. Verify accessibility features
5. Check responsive design

## 📈 **Performance Optimization**

### **Lambda Optimizations**
- Set appropriate memory allocation
- Use provisioned concurrency for critical functions
- Optimize cold start times
- Enable compression

### **Database Optimizations**
- Add appropriate indexes
- Configure connection pooling
- Set up read replicas if needed
- Monitor query performance

### **Frontend Optimizations**
- Enable CloudFront caching
- Compress assets
- Use lazy loading
- Optimize images

## 🔄 **CI/CD Pipeline**

### **GitHub Actions Example**
```yaml
name: Deploy Kiru Platform

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy Lambda functions
        run: |
          # Deploy each Lambda function
          
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build and deploy frontend
        run: |
          npm install
          npm run build
          # Deploy to S3/Netlify
```

## 💰 **Cost Estimation**

### **Monthly Costs (1000 active users)**
- **Lambda**: $10-50 (depending on usage)
- **RDS**: $15-30 (db.t3.micro)
- **API Gateway**: $3-10
- **S3 + CloudFront**: $5-15
- **Bedrock**: $50-200 (depending on AI usage)

**Total**: $83-305/month

## 🆘 **Troubleshooting**

### **Common Issues**
1. **Lambda timeout**: Increase timeout to 60 seconds
2. **Database connection**: Check security groups and VPC
3. **CORS errors**: Verify API Gateway CORS configuration
4. **Bedrock access**: Ensure model access is enabled
5. **Environment variables**: Double-check all required variables

### **Logs to Check**
- CloudWatch Lambda logs
- API Gateway access logs
- RDS performance insights
- Frontend browser console
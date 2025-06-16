#!/bin/bash

# BlackJack Frontend Deployment Script
set -e

echo "🚀 Starting BlackJack Frontend Deployment..."

# Configuration
STACK_NAME="blackjack-frontend-stack"
BUCKET_PREFIX="blackjack-frontend-app"
ENVIRONMENT="prod"
REGION="us-east-2"

# Build React App
echo "📦 Building React application..."
npm install
npm run build

# Deploy CloudFormation Stack
echo "☁️ Deploying CloudFormation stack..."
aws cloudformation deploy \
  --template-file cloudformation-frontend.yml \
  --stack-name $STACK_NAME \
  --parameter-overrides \
    BucketName=$BUCKET_PREFIX \
    Environment=$ENVIRONMENT \
  --region $REGION \
  --capabilities CAPABILITY_IAM

# Get stack outputs
echo "📋 Getting stack outputs..."
S3_BUCKET=$(aws cloudformation describe-stacks \
  --stack-name $STACK_NAME \
  --region $REGION \
  --query 'Stacks[0].Outputs[?OutputKey==`S3BucketName`].OutputValue' \
  --output text)

CLOUDFRONT_DOMAIN=$(aws cloudformation describe-stacks \
  --stack-name $STACK_NAME \
  --region $REGION \
  --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontDomainName`].OutputValue' \
  --output text)

echo "✅ Stack deployed successfully!"
echo "📦 S3 Bucket: $S3_BUCKET"
echo "🌐 CloudFront Domain: $CLOUDFRONT_DOMAIN"

# Upload build files to S3
echo "📤 Uploading build files to S3..."
aws s3 sync build/ s3://$S3_BUCKET --delete --region $REGION

# Invalidate CloudFront cache
echo "🔄 Invalidating CloudFront cache..."
DISTRIBUTION_ID=$(aws cloudformation describe-stacks \
  --stack-name $STACK_NAME \
  --region $REGION \
  --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontDistributionId`].OutputValue' \
  --output text)

aws cloudfront create-invalidation \
  --distribution-id $DISTRIBUTION_ID \
  --paths "/*" \
  --region $REGION

echo ""
echo "🎉 Deployment Complete!"
echo "🌐 Your app is available at: https://$CLOUDFRONT_DOMAIN"
echo ""
echo "Note: CloudFront propagation may take 5-15 minutes for global availability." 
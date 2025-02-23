#!/bin/bash
docker build -f Dockerfile.analyzer -t video-analyzer .
docker tag video-analyzer:latest 054037111001.dkr.ecr.us-east-1.amazonaws.com/video-analyzer:latest
docker push 054037111001.dkr.ecr.us-east-1.amazonaws.com/video-analyzer:latest

docker build -f Dockerfile.predictor -t view-predictor .
docker tag view-predictor:latest 054037111001.dkr.ecr.us-east-1.amazonaws.com/view-predictor:latest
docker push 054037111001.dkr.ecr.us-east-1.amazonaws.com/view-predictor:latest

# Set variables
REGION="us-east-1"
ACCOUNT_ID="054037111001"
ANALYZER_ECR="video-analyzer"
PREDICTOR_ECR="view-predictor"

# Login to ECR
aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com

# Create ECR repositories if they don't exist
aws ecr create-repository --repository-name $ANALYZER_ECR --region $REGION || true
aws ecr create-repository --repository-name $PREDICTOR_ECR --region $REGION || true

# Build and push analyzer
docker build -f Dockerfile.analyzer -t $ANALYZER_ECR .
docker tag $ANALYZER_ECR:latest $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$ANALYZER_ECR:latest
docker push $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$ANALYZER_ECR:latest

# Build and push predictor
docker build -f Dockerfile.predictor -t $PREDICTOR_ECR .
docker tag $PREDICTOR_ECR:latest $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$PREDICTOR_ECR:latest
docker push $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$PREDICTOR_ECR:latest

# Update Lambda functions
aws lambda update-function-code \
    --function-name video-analyzer \
    --image-uri $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$ANALYZER_ECR:latest

aws lambda update-function-code \
    --function-name view-predictor \
    --image-uri $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$PREDICTOR_ECR:latest 
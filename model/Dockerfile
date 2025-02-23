FROM public.ecr.aws/lambda/python:3.10

LABEL maintainer="Your Name"
LABEL description="Video Analysis and View Prediction Lambda Function"

# Install system dependencies
RUN yum update -y && \
    yum groupinstall -y "Development Tools" && \
    yum install -y \
    libgomp \
    gcc \
    gcc-c++ \
    python3-devel \
    llvm11-devel \
    llvm11-static \
    cmake

# Copy requirements first to leverage Docker cache
COPY requirements.txt .
RUN pip3 install -r requirements.txt --no-cache-dir

# Create models directory
RUN mkdir -p ${LAMBDA_TASK_ROOT}/

# Copy function code and model
COPY lambda_predictor.py ${LAMBDA_TASK_ROOT}/
COPY lambda_video_analyzer.py ${LAMBDA_TASK_ROOT}/
COPY stacking_view_predictor.pkl ${LAMBDA_TASK_ROOT}/

# Set the CMD to your handler
CMD [ "lambda_predictor.lambda_handler" ] 
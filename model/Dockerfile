FROM public.ecr.aws/lambda/python:3.9

LABEL maintainer="Your Name"
LABEL description="ML Model Lambda Function"

# Copy requirements first to leverage Docker cache
COPY requirements.txt .
RUN pip3 install -r requirements.txt --no-cache-dir

# Copy function code and model
COPY app.py ${LAMBDA_TASK_ROOT}/
COPY model.joblib ${LAMBDA_TASK_ROOT}/

# Set the CMD to your handler
CMD [ "app.lambda_handler" ] 
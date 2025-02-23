import joblib
import numpy as np
from sklearn.linear_model import LinearRegression
from typing import Dict, Any
import os
import json

# Get Lambda runtime path
LAMBDA_TASK_ROOT = os.environ.get('LAMBDA_TASK_ROOT', '')
MODEL_PATH = os.path.join(LAMBDA_TASK_ROOT, 'model.joblib')

# Create and save model during build time
X = np.array([[1], [2], [3], [4], [5]])
y = np.array([2, 4, 6, 8, 10])
model = LinearRegression()
model.fit(X, y)

def lambda_handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    AWS Lambda handler function
    """
    try:
        # Handle both direct input and body-wrapped input
        if isinstance(event, dict):
            if 'input' in event:
                # Direct input case
                input_value = float(event['input'])
            elif 'body' in event:
                # API Gateway case
                body = event['body']
                if isinstance(body, str):
                    body = json.loads(body)
                input_value = float(body.get('input', 0))
            else:
                input_value = 0
        
        # Make prediction
        prediction = model.predict([[input_value]])[0]
        
        return {
            'statusCode': 200,
            'body': {
                'input': input_value,
                'prediction': float(prediction)
            }
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': str(e)
        }

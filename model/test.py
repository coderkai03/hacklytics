import requests
import json

# Lambda URL
url = "https://4vp4ftszovzer3a6spujdys4ey0hxclg.lambda-url.us-east-1.on.aws/"

# Test data
payload = {
    "input": 23452345
}

# Make the POST request
response = requests.post(url, json=payload)

# Print the response
print("Status Code:", response.status_code)
print("Response:", response.json())

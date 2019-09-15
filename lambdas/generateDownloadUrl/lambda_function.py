import boto3
import os

"""
    Generate a presigned URL for a download from S3
"""

db = boto3.client("dynamodb")
s3 = boto3.client("s3")
BUCKET = os.environ["s3Bucket"]
TABLE = os.environ["dbTable"]

def lambda_handler(event, context):
    
    try:
        # Add an entry to the DB table
        dbResponse = db.get_item(
            TableName = TABLE,
            Key = {
                "fileId": { "S": event["fileId"] }
            }
        )
        
        # Generate the presigned URL for GET requests
        presigned_url = s3.generate_presigned_url(
            ClientMethod = "get_object",
            Params = {
                "Bucket": BUCKET,
                "Key": dbResponse["Item"]["s3Key"]["S"],
                "ResponseContentType": dbResponse["Item"]["type"]["S"],
                "ResponseContentDisposition": "attachment;filename=" + \
                        dbResponse["Item"]["filename"]["S"] # Set the filename
            },
            ExpiresIn = 1800 # The link is valid for 30 min
        )
    
        # Return the presigned URL and fileId as the response to the API request
        return {
            "url": presigned_url
        }
    except KeyError as e:
        raise Exception("<404> This file does not exist")
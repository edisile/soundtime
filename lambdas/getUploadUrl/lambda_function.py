import uuid
import boto3
from nanoid import generate
from datetime import datetime

"""
    Generate a presigned URL for a PUT request to S3
    It is expected that event has the following structure:
        {
            "filename": string,
            "size": int,
            "type": string
        }
    The event data, file's ID and its S3 key are added to a DynamoDB table; if 
    after the PUT to S3 the declared file size doesn't match the uploaded one 
    the file gets removed together with the DD entry.
"""

def lambda_handler(event, context):
    # Get a S3 service client
    s3 = boto3.client("s3")
    # Get a DynamoDB service client as well
    db = boto3.client("dynamodb")
    
    # Generate a random file id to retrieve the file
    fileId = generate("0123456789abcdefghijklmnopqrstuvwxyz" \
                        "ABCDEFGHIJKLMNOPQRSTUVWXYZ", size=6)
    # Generate a random file id to save the file in the S3 bucket
    s3ObjectKey = uuid.uuid4().hex
    
    # Add an entry to the DB table
    response = db.put_item(
        TableName = "soundtime-data",
        Item = {
            "fileId": {"S": fileId},
            "s3Key": {"S": s3ObjectKey},
            "filename": {"S": event["filename"]},
            "size": {"N": event["size"]},
            "timestamp": {"S": datetime.isoformat(datetime.now())},
            "type": {"S": event["type"]}
        })
    
    # Generate the presigned URL for put requests
    presigned_url = s3.generate_presigned_url(
        ClientMethod = "put_object",
        Params = {
            "Bucket": "soundtime-data",
            "Key": s3ObjectKey
        },
        ExpiresIn = 300 # The link is valid for 300 s = 5 min
    )

    # Return the presigned URL and fileId as the response to the API request
    return {
        "id": fileId, # This will be used to retrieve the file
        "url": presigned_url
    }
import uuid
import boto3
import os
from datetime import datetime
from nanoid import generate
from time import time
from urllib.parse import unquote

"""
    Generate a presigned URL for a PUT request to S3
    It is expected that event has the following structure:
        {
            "filename": string,
            "size": int,
            "type": string,
            "md5": string (base64 encoded md5 sum of the file)
        }
"""

s3 = boto3.client("s3")
db = boto3.client("dynamodb")
BUCKET = os.environ["s3Bucket"]
TABLE = os.environ["dbTable"]

def lambda_handler(event, context):
    
    # Generate a random file id to retrieve the file
    fileId = generate("0123456789abcdefghijklmnopqrstuvwxyz" \
                        "ABCDEFGHIJKLMNOPQRSTUVWXYZ", size=6)
    # Generate a random file id to save the file in the S3 bucket
    s3ObjectKey = uuid.uuid4().hex
    
    try:
        fileSize = int(event["size"]) # Raises ValueError on bad request
        
        # 10 minutes from now the db entry will be deleted unless updated with 
        # a longer TTL; 10 minutes are more than enough to upload and process 
        # a file
        ttl = int(time()) + 600
        
        # Add an entry to the DB table
        response = db.put_item(
            TableName = TABLE,
            Item = {
                "fileId": {"S": fileId},
                "s3Key": {"S": s3ObjectKey},
                "filename": {"S": unquote(event["filename"])},
                "size": {"N": str(fileSize)},
                "ttl": {"N": "%d" % ttl},
                "timestamp": {"S": datetime.isoformat(datetime.now())},
                "type": {"S": event["type"]}
            })
    
        # Generate the presigned URL for put requests
        presigned_url = s3.generate_presigned_url(
            ClientMethod = "put_object",
            Params = {
                "Bucket": BUCKET,
                "Key": s3ObjectKey,
                "ContentLength": fileSize,
                "ContentMD5": event["md5"],
                "ContentType": event["type"]
            }, 
            ExpiresIn = 600 # The link is valid for 600 s = 10 min
        )
    
        # Return the presigned URL and fileId as the response to the API request
        return {
            "id": fileId, # This will be used to retrieve the file
            "url": presigned_url
        }
    except ValueError:
        raise Exception("<400> Bad request: file size is not a number")
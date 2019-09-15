import boto3
import os
from time import time

"""
    Return the info of a file from the DynamoDB table.
"""

db = boto3.client("dynamodb")
s3 = boto3.client("s3")
BUCKET = os.environ["s3Bucket"]
TABLE = os.environ["dbTable"]

def lambda_handler(event, context):

    try:
        dbResponse = db.get_item(
            TableName = TABLE,
            Key = {
                "fileId": { "S": event["fileId"] }
            }
        )
        
        dbResponse["Item"] # Trigger KeyError if the file does not exist
        
        # Get tags from the file if available
        tags = {}
        for tag in ["artist", "title", "album", "image"]:
            try:
                tags[tag] = dbResponse["Item"][tag]["S"]
            except KeyError:
                pass
        
        # Generate a presigned link to access the track preview
        previewLink = s3.generate_presigned_url(
            ClientMethod = "get_object",
            Params = {
                "Bucket": BUCKET,
                "Key": "previews/" + dbResponse["Item"]["s3Key"]["S"],
                "ResponseContentType": "audio/ogg",
            },
            ExpiresIn = 1800 # The link is valid for 30 min
        )
        
        newTtl = int(time()) + (14*24*60*60) # 14 days in seconds
        # newTtl = int(time()) + 10
        
        currentTtl = int(dbResponse["Item"]["ttl"]["N"])
        
        # Update the entry to prolong the life of the object only if it's by 
        # a day or more
        if (newTtl - currentTtl) >= 24*60*60:
            response = db.update_item(
                TableName = TABLE,
                Key = {
                    "fileId": {"S": event["fileId"]},
                },
                AttributeUpdates = {
                    "ttl": {
                        "Value": {"N": "%d" % newTtl}
                    }
                }
            )
        
        return {
            "filename": dbResponse["Item"]["filename"]["S"],
            "fileType": dbResponse["Item"]["type"]["S"],
            "size": dbResponse["Item"]["size"]["N"],
            "uploadDate": dbResponse["Item"]["timestamp"]["S"],
            "preview": previewLink,
            "tags": tags
        }
        
    except KeyError as e:
        raise Exception("<404> This file does not exist")
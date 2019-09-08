import boto3

"""
    Generate a presigned URL for a download from S3
"""

def lambda_handler(event, context):
    # Get a S3 service client
    s3 = boto3.client("s3")
    # Get a DynamoDB service client as well
    db = boto3.client("dynamodb")
    
    try:
        # Add an entry to the DB table
        dbResponse = db.get_item(
            TableName = "soundtime-data",
            Key = {
                "fileId": { "S": event["fileId"] }
            }
        )
        
        # Generate the presigned URL for GET requests
        presigned_url = s3.generate_presigned_url(
            ClientMethod = "get_object",
            Params = {
                "Bucket": "soundtime-data",
                "Key": dbResponse["Item"]["s3Key"]["S"],
                "ResponseContentType": dbResponse["Item"]["type"]["S"],
                "ResponseContentDisposition": "attachment;filename=" + \
                        dbResponse["Item"]["filename"]["S"] # Set the filename
            },
            ExpiresIn = 600 # The link is valid for 600 s = 10 min
        )
    
        # Return the presigned URL and fileId as the response to the API request
        return {
            "url": presigned_url
        }
    except KeyError as e:
        raise Exception("<404> This file does not exist")
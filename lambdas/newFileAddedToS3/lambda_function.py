import json
import boto3

"""
    When a new file is added to the data bucket check if it matches a file 
    previously added to the DynamoDB table; if the match exists "enable" the 
    file, otherwise it will be removed at the next scheduled cleanup job.
"""

def lambda_handler(event, context):
    s3ObjectKey = event['Records'][0]['s3']['object']['key']
    s3ObjectSize = event['Records'][0]['s3']['object']['size']
    
    print(s3ObjectKey, s3ObjectSize)
    
    db = boto3.client("dynamodb")
    
    response = db.query(
        TableName = "soundtime-data",
        IndexName = "s3Key-index",
        KeyConditionExpression = "s3Key = :key",
        ExpressionAttributeValues = {
            ":key": {"S": s3ObjectKey}
        }
    )
    
    try:
        # Let's update the DB entry to "enable" it
        fileId = response["Items"][0]["fileId"]["S"]
        
        # TODO: recreate index to store size as well and check size
        
        response = db.update_item(
            TableName = "soundtime-data",
            Key = {
                "fileId": {"S": fileId},
            },
            AttributeUpdates = {
                "active": {
                    'Value': {"BOOL": True}
                }
            }
        )
    except (IndexError, KeyError) as e:
        "Ok, this file doesn't exist in the DB for some reason... :|"
        return e

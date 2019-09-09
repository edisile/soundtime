import boto3
import os
from time import time

"""
    Iterate over the DynamoDB stream looking for the items whose TTL is up and 
    remove them from the DB and S3 bucket
"""

print("Beginning fileRemoval")
s3 = boto3.client("s3")
BUCKET = os.environ["s3Bucket"]

ttlUserId = {
    "type": "Service",
    "principalId":"dynamodb.amazonaws.com"
}

def isRemoveByTtl(record):
    eventName = record["eventName"]
    try:
        eventUserId = record["userIdentity"]
        return (eventName == "REMOVE" and eventUserId == ttlUserId)
    except KeyError:
        return False

def lambda_handler(event, context):
    print("Received %d records" % len(event["Records"]))
    
    ttlRecords = list(filter(isRemoveByTtl, event["Records"]))
    
    if ttlRecords == []:
        print("No records to be removed for TTL")
        return
    
    print( "There are %d records whose TTL ran out" % len(ttlRecords) )
    
    errors = []
    
    for record in ttlRecords:
        try:
            eventName = record["eventName"]
            eventUserId = record["userIdentity"]
            
            # discard inserts and updates, look only for removes which happen 
            # when TTL is up
            if eventName == "REMOVE" and eventUserId == ttlUserId:
                oldImage = record['dynamodb']['OldImage']
                key = oldImage["s3Key"]["S"]
                
                print("Removing S3 key %s" % key)
                
                response = s3.delete_object(
                        Bucket = BUCKET,
                        Key = key)
                
                print(response)
                
                response = s3.delete_object(
                        Bucket = BUCKET, 
                        Key = "previews/" + key)
                
                print(response)
    
        except KeyError as e:
            print("Record doesn't have a s3Key")
            pass
        except ClientError as e:
            print("Error while removing")
            pass
    
    
    if errors != []:
        print("Errors encountered: ", errors)
        raise Exception
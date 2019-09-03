from datetime import datetime
from io import BytesIO
from tinytag import TinyTag
import boto3
import os
import subprocess

FFMPEG_STATIC = "/var/task/ffmpeg"

"""
    When a new file is added to the data bucket check if it matches a file 
    previously added to the DynamoDB table; if the match exists "enable" the 
    file, otherwise it will be removed at the next scheduled cleanup job.
"""

def lambda_handler(event, context):
    s3Bucket = event["Records"][0]["s3"]["bucket"]["name"]
    s3ObjectKey = event["Records"][0]["s3"]["object"]["key"]
    s3ObjectSize = event["Records"][0]["s3"]["object"]["size"]
    
    print(s3ObjectKey, s3ObjectSize)
    
    db = boto3.client("dynamodb")
    s3 = boto3.client("s3")
    
    response = db.query(
        TableName = "soundtime-data",
        IndexName = "s3Key-index",
        KeyConditionExpression = "s3Key = :key",
        ExpressionAttributeValues = {
            ":key": {"S": s3ObjectKey}
        }
    )
    
    try:
        # Let"s update the DB entry to "enable" it
        fileId = response["Items"][0]["fileId"]["S"]
        
        response = db.update_item(
            TableName = "soundtime-data",
            Key = {
                "fileId": {"S": fileId},
            },
            AttributeUpdates = {
                "active": {
                    "Value": {"BOOL": True}
                },
                "lastAccess": {
                    "Value": {"S": datetime.isoformat(datetime.now())}
                }
            }
        )
        
        process = convertAudio(s3Bucket, s3ObjectKey, s3)

        ###                      Do more stuff here                     ###

        process.wait()

        if process.returncode != 0:
            raise Exception("ffmpeg returned with code %d" % p.returncode)

        pushToS3(s3Bucket, s3ObjectKey, s3)

        return

    except (IndexError, KeyError) as e:
        "Ok, this file doesn't exist in the DB for some reason... :|"
        raise e

def convertAudio(bucket, s3Key, s3Client):
    # Get the audio from S3
    audioData = grabFromS3(bucket, s3Key, s3Client)

    # Write it to a file in /tmp/
    os.system("chmod -R 775 /tmp")
    with open("/tmp/" + s3Key, "wb") as f:
        f.write(audioData.read())
    os.chdir("/tmp/")

    # Convert using ffmpeg
    process = subprocess.Popen(
                [FFMPEG_STATIC, "-y", "-i", s3Key, "-c:a", "libvorbis", 
                        "-b:a", "128k", "-vn", "converted_file.ogg"], 
                stdin=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    return process

def grabFromS3(bucket, s3Key, s3Client):
    obj = s3Client.get_object(Bucket=bucket, Key=s3Key)
    data = BytesIO(obj["Body"].read())

    return data

def pushToS3(bucket, filename, s3Client):
    s3Client.upload_file("/tmp/converted_file.ogg", bucket, 
                            "previews/" + filename)
from base64 import b64encode
from time import time
from io import BytesIO
from tinytag import TinyTag as tt
import boto3
import os
import subprocess

FFMPEG_STATIC = "/var/task/ffmpeg"

TYPES = {
    "audio/mp3": ".mp3",
    "audio/ogg": ".ogg",
    "audio/opus": ".opus",
    "audio/flac": ".flac",
    "audio/mp4": ".mp4",
    "audio/x-m4a": ".m4a",
    "audio/wav": ".wav"
}

"""
    When a new file is added to the data bucket check if it matches a file 
    previously added to the DynamoDB table; if the match exists "enable" the 
    file, otherwise it will be removed at the next scheduled cleanup job.
"""

db = boto3.client("dynamodb")
s3 = boto3.client("s3")
BUCKET = os.environ["s3Bucket"]
TABLE = os.environ["dbTable"]

def lambda_handler(event, context):
    s3Bucket = event["Records"][0]["s3"]["bucket"]["name"]
    s3ObjectKey = event["Records"][0]["s3"]["object"]["key"]
    
    response = db.query(
        TableName = TABLE,
        IndexName = "s3Key-index",
        KeyConditionExpression = "s3Key = :key",
        ExpressionAttributeValues = {
            ":key": {"S": s3ObjectKey}
        }
    )
    
    try:
        fileId = response["Items"][0]["fileId"]["S"]
        fileType = response["Items"][0]["type"]["S"]

        extension = TYPES[fileType]
        tmpFile = "file" + extension

        # Get the audio from S3
        audioData = grabFromS3(s3Bucket, s3ObjectKey, s3)

        # Write it to a file in /tmp/
        os.system("chmod -R 775 /tmp")
        os.chdir("/tmp/")
        with open(tmpFile, "wb") as f:
            f.write(audioData.read())

        # Fork a process for the audio conversion task, meanwhile let's do 
        # other stuff  
        process = convertAudio(tmpFile)

        if extractCover(tmpFile) == 0:
            # File had cover art so we must load it
            with open("cover.jpg", "rb") as f:
                b64ImgStr = "data:image/jpg;base64," + \
                                b64encode(f.read()).decode("utf-8")
        else: 
            b64ImgStr = ""

        # The TTL of the file is gonna be 14 days from now
        ttl = int(time()) + (14*24*60*60) # 14 days in seconds
        attrUpdates = {
                "ttl": {
                    "Value": {"N": "%d" % ttl}
                },
                "image": {
                    "Value": {"S": b64ImgStr}
                }
            }

        # Get tags if available, then add them to the dynamoDB attributes update
        tags = tt.get(tmpFile).as_dict();
        for key in ["title", "artist", "album"]:
            if tags[key]:
                attrUpdates[key] = {
                    "Value": {"S": tags[key]}
                }

        response = db.update_item(
            TableName = TABLE,
            Key = {
                "fileId": {"S": fileId},
            },
            AttributeUpdates = attrUpdates
        )

        process.wait()

        if process.returncode != 0:
            raise Exception("ffmpeg returned with code %d" % p.returncode)

        pushToS3(s3Bucket, s3ObjectKey, s3)

        return

    except (IndexError, KeyError) as e:
        "Ok, this file doesn't exist in the DB for some reason... :|"
        raise e

def convertAudio(filename):
    # Convert using ffmpeg
    process = subprocess.Popen(
                [FFMPEG_STATIC, "-y", "-i", filename, "-c:a", "libvorbis", 
                        "-b:a", "128k", "-vn", "converted_file.ogg"], 
                stdin=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    return process

def extractCover(filename):
    return subprocess.call([FFMPEG_STATIC, "-y", "-i", filename, "-an", "-vf", 
                "scale=500:500", "cover.jpg"], stderr=subprocess.DEVNULL)

def grabFromS3(bucket, s3Key, s3Client):
    obj = s3Client.get_object(Bucket=bucket, Key=s3Key)
    data = BytesIO(obj["Body"].read())

    return data

def pushToS3(bucket, filename, s3Client):
    s3Client.upload_file("/tmp/converted_file.ogg", bucket, 
                            "previews/" + filename)
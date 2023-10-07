import { DeleteObjectsCommand, S3Client } from "@aws-sdk/client-s3";
import { unlink } from "fs/promises";
const bucketName = process.env.AWS_BUCKET_NAME;

export default async function s3DeleteFiles(fileList) {
  try {
    if (process.env.NEXT_PUBLIC_LOCAL_FILE_SOURCE == "true") {
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        const filepath = `${process.cwd()}/public/uploads/${file.Key}`;
        await unlink(filepath);
      }
    } else {
      const client = new S3Client({});
      const params = {
        Bucket: bucketName,
        Delete: {
          Objects: fileList,
        },
      };
      const command = new DeleteObjectsCommand(params);
      await client.send(command);
    }
  } catch (err) {
    console.log(err);
  }
}

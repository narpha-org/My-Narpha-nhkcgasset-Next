import { S3 } from "aws-sdk";
import { PutObjectRequest } from "aws-sdk/clients/s3";

// S3の設定
const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_DEFAULT_REGION,
});

// S3に画像をアップロードし、そのURLを取得する関数
export const uploadImageToS3Glacier = async (
  file: File
): Promise<S3.ManagedUpload.SendData | null> => {
  // アップロード時のファイル名を作成
  const fileName = `${Date.now()}-${file.name}`;
  // S3へのアップロードに必要な情報をまとめるオブジェクト
  const params: PutObjectRequest = {
    Bucket: process.env.AWS_BUCKET as string,
    Key:
      (process.env.AWS_BUCKET_PATH ? process.env.AWS_BUCKET_PATH : "") +
      fileName,
    ContentType: file.type,
    Body: file,
    ACL: "public-read",
    StorageClass: "DEEP_ARCHIVE",
  };
  // Bucket: アップロード先のバケット名を環境変数から取得します。
  // Key: アップロードするファイルのキーを指定します。
  // ContentType: アップロードするファイルのMIMEタイプを指定します。
  // Body: アップロードするファイルデータを指定します。
  console.log("アップロードparams:", params);

  try {
    // S3に画像をアップロードする
    const data = await s3.upload(params).promise();
    // アップロード成功時の処理
    console.log("アップロード成功:", data.Location);
    console.log("アップロード情報:", data);
    // アップロードされた画像のURLを取得
    return data;
  } catch (error) {
    // アップロードエラー発生時の処理
    console.error("アップロードエラー:", error);
    // null値を返す
    return null;
  }
};

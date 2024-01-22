import { Upload } from "@aws-sdk/lib-storage";
import {
  PutObjectCommandInput,
  CompleteMultipartUploadCommandOutput,
  S3Client,
} from "@aws-sdk/client-s3";

// S3の設定
const client = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
  region: process.env.AWS_DEFAULT_REGION,
});

// S3に画像をアップロードし、そのURLを取得する関数
export const uploadImageToS3 = async (
  file: File
): Promise<CompleteMultipartUploadCommandOutput | null> => {
  // アップロード時のファイル名を作成
  const fileName = `${Date.now()}-${file.name}`;
  // S3へのアップロードに必要な情報をまとめるオブジェクト
  const params: PutObjectCommandInput = {
    Bucket: process.env.AWS_BUCKET as string,
    Key:
      (process.env.AWS_BUCKET_PATH ? process.env.AWS_BUCKET_PATH : "") +
      fileName,
    ContentType: file.type,
    Body: file,
    ACL: "public-read",
  };
  // Bucket: アップロード先のバケット名を環境変数から取得します。
  // Key: アップロードするファイルのキーを指定します。
  // ContentType: アップロードするファイルのMIMEタイプを指定します。
  // Body: アップロードするファイルデータを指定します。
  // console.log("アップロードparams:", params);

  try {
    // S3に画像をアップロードする
    const data = await new Upload({
      client,
      params,
    }).done();
    // アップロード成功時の処理
    // console.log("アップロード成功:", data.Location);
    // console.log("アップロード情報:", data);
    // アップロードされた画像のURLを取得
    return data;
  } catch (error) {
    // アップロードエラー発生時の処理
    console.error("アップロードエラー:", error);
    // null値を返す
    return null;
  }
};

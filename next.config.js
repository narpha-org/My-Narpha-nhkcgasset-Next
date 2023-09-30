/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "mynarpha.s3.ap-northeast-1.amazonaws.com",
      "res.cloudinary.com",
      "picsum.photos",
      "rawr.narpha.org",
    ],
  },
  env: {
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_DEFAULT_REGION: process.env.AWS_DEFAULT_REGION,
    AWS_BUCKET: process.env.AWS_BUCKET,
    AWS_BUCKET_PATH: process.env.AWS_BUCKET_PATH,
  },
};

module.exports = nextConfig;

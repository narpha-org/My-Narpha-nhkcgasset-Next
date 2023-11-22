/** @type {import('next').NextConfig} */
const nextConfig = {
  crossOrigin: "anonymous",
  images: {
    domains: [
      "mynarpha.s3.ap-northeast-1.amazonaws.com",
      "res.cloudinary.com",
      "picsum.photos",
      "rawr.narpha.org",
    ],
  },
  env: {
    NEXT_PUBLIC_BASE_DOMAIN: process.env.NEXT_PUBLIC_BASE_DOMAIN,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_JWT_SECRET: process.env.NEXTAUTH_JWT_SECRET,
    NEXT_PUBLIC_API_ENDOPOINT: process.env.NEXT_PUBLIC_API_ENDOPOINT,
    API_ENDOPOINT: process.env.API_ENDOPOINT,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,

    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_DEFAULT_REGION: process.env.AWS_DEFAULT_REGION,
    AWS_BUCKET: process.env.AWS_BUCKET,
    AWS_BUCKET_PATH: process.env.AWS_BUCKET_PATH,

    OKTA_CLIENT_ID: process.env.OKTA_CLIENT_ID,
    OKTA_CLIENT_SECRET: process.env.OKTA_CLIENT_SECRET,
    OKTA_ISSUER: process.env.OKTA_ISSUER,
    OKTA_LOGOUT: process.env.OKTA_LOGOUT,
  },
};

module.exports = nextConfig;

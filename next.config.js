/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    ACCESS_TOKEN: process.env.ACCESS_TOKEN,
    SPACE_ID: process.env.SPACE_ID,
  },
};

module.exports = nextConfig;

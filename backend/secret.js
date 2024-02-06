import "dotenv/config";

const port = process.env.PORT;

const MONGODB_URI = process.env.MONGODB_URI;

const accessTokenSecret = process.env.JWT_ACCESS_TOKEN;
const refreshTokenSecret = process.env.JWT_REFRESH_TOKEN;

export { port, MONGODB_URI, accessTokenSecret, refreshTokenSecret };

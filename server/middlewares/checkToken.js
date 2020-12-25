const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
require("dotenv").config();
const client = new OAuth2Client(process.env.CLIENT_ID);

const TYPE = {
  GOOGLE: "google",
  NORMAL: "normal",
};

const { REFRESH_TOKEN_SECRET } = process.env;

function generateToken(email) {
  return jwt.sign({ email }, REFRESH_TOKEN_SECRET, { expiresIn: "1d" });
}

function verifyToken(token) {
  token = token.slice(7, token.length);
  return jwt.verify(token, REFRESH_TOKEN_SECRET, (error, decoded) => {
    if (error) return false;
    return decoded;
  });
}

module.exports = { generateToken, verifyToken, TYPE };

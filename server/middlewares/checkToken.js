const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
require("dotenv").config();
const client = new OAuth2Client(process.env.CLIENT_ID);

const TYPE = {
GOOGLE: 'google',
NORMAL: 'normal'
}

const { REFRESH_TOKEN_SECRET } = process.env;

function generateToken(email) {
  return jwt.sign({ email }, REFRESH_TOKEN_SECRET, { expiresIn: "1d" });
}

async function verifyToken(token, type) {
  switch (type) {
    case TYPE.GOOGLE:
      try {
        const ticket = await client.verifyIdToken({
          idToken: token.split("bearer ")[1],
          audience: process.env.CLIENT_ID,
        });
        const payload = ticket.getPayload();
        return { email: payload.email };
      } catch (err) {
        return false;
      }
    case TYPE.NORMAL:
      token = token.slice(7, token.length);
      return jwt.verify(token, REFRESH_TOKEN_SECRET, (error, decoded) => {
        if (error) return false;
        return decoded;
      });
    default:
      return false;
  }
}

module.exports = { generateToken, verifyToken, TYPE };

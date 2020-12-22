const jwt = require('jsonwebtoken');
const {OAuth2Client} = require('google-auth-library');
require('dotenv').config();
const client = new OAuth2Client(process.env.CLIENT_ID);

const { REFRESH_SECRET } = process.env

function generateToken(email) {
return jwt.sign(
{email},
REFRESH_SECRET,
{ expiresIn: '1d' })
}

async function verifyGoogleToken(token) {
try {
  const ticket = await client.verifyIdToken({
      idToken: token.split('bearer ')[1],
      audience: process.env.CLIENT_ID
  });
  const payload = ticket.getPayload();
  return ({email: payload.email})
} catch (err) {
return false
}
}

function verifyNormalToken(token) {
    token = token.slice(7, token.length);
      return jwt.verify(token, REFRESH_SECRET, (error, decoded) => {
        if (error) return false
        return decoded
      })
}

module.exports = { generateToken, verifyNormalToken, verifyGoogleToken }
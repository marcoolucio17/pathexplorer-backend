const { decryptToken } = require('../utils/token'); 

/**
 * Authentication middleware that validates the user token and their role.
 * If there's no token sent, then it returns an error.
 * If decryption doesn't work, then it's not a valid token.
 * @param {http request} req 
 * @param {http response} res 
 * @param {next function} next 
 * @returns void
 */
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const data = decryptToken(token);

    // this checks expiration altough i'm not sure if we'll fully implement it
    if (Date.now() > data.expiresAt) {
      return res.status(401).json({ error: 'Token expired' });
    }

    req.user = data; 
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = authMiddleware;

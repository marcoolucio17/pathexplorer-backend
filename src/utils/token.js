const crypto = require('crypto');

const ENCRYPTION_KEY = crypto.createHash('sha256').update(process.env.HASH_SECRET).digest(); 
const IV_LENGTH = 16; 

function encryptPayload(payload) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);

  const jsonData = JSON.stringify(payload);
  let encrypted = cipher.update(jsonData, 'utf8', 'base64');
  encrypted += cipher.final('base64');

  // Output: iv:encrypted (both base64-encoded)
  const token = `${iv.toString('base64')}:${encrypted}`;
  return token;
}


function decryptToken(token) {
    const [ivEncoded, encryptedData] = token.split(':');
    const iv = Buffer.from(ivEncoded, 'base64');
  
    const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
  
    return JSON.parse(decrypted);
  }
  

module.exports = { encryptPayload, decryptToken };

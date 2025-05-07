const crypto = require("crypto");
const ApiError = require("./errorHelper")

const ENCRYPTION_KEY = crypto
  .createHash("sha256")
  .update(process.env.HASH_SECRET)
  .digest();
const IV_LENGTH = 16;

/**
 * Method that encrypts a payload based on our hash key and sends it as an access token into the client.
 * @param {string} payload 
 * @returns 
 */
function encryptPayload(payload) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);

  const jsonData = JSON.stringify(payload);
  let encrypted = cipher.update(jsonData, "utf8", "base64");
  encrypted += cipher.final("base64");

  const token = `${iv.toString("base64")}:${encrypted}`;
  return token;
}

/**
 * Method that receives an authentication token and decrypts it.
 * @param {string} token 
 * @returns string decrypted token
 */
function decryptToken(token) {
  try {
    const [ivEncoded, encryptedData] = token.split(":");
    if (!ivEncoded || !encryptedData) {
      throw new ApiError(401, "Invalid authentication token.")
    }

    const iv = Buffer.from(ivEncoded, "base64");
    const decipher = crypto.createDecipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);

    let decrypted = decipher.update(encryptedData, "base64", "utf8");
    decrypted += decipher.final("utf8");

    return JSON.parse(decrypted);
  } catch (error) {
    throw new ApiError(401, "Non-valid token was sent. Please sign-in with correct credentials.");
  }
}

module.exports = { encryptPayload, decryptToken };

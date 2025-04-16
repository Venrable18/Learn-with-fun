const { encrypt, decrypt } = require("../lib/crypto");


/**
 * Encrypts the provided input if encryption is enabled and a valid SECRET_KEY is provided.
 * @returns The original input if encryption is disabled, or an encrypted string if encryption is enabled.
 */
function getEncryptedText(input) {
  // Use the environment variable for encryption setting
  const APPLY_ENCRYPTION = process.env.APPLY_ENCRYPTION === 'true' || false;
  const { SECRET_KEY } = process.env;

  // check if encryption is enabled and secret_key is provided
  if (APPLY_ENCRYPTION && SECRET_KEY) {
    // convert the input to a json string if its not a string
    const output = typeof input === "string" ? input : JSON.stringify(input);

    // encrypt and return the encrypted data
    return encrypt(output, SECRET_KEY);
  }

  // return the original input if encryption is not supported
  return input;
}

/**
 * Decrypts the provided encrypted input if decryption is enabled and a valid SECRET_KEY is provided.
 * @param {string} encryptedInput - The encrypted string to decrypt
 * @returns {any} - The decrypted data, parsed from JSON if it was originally an object
 */
function decodeEncryptedText(encryptedInput) {
  // Use the environment variable for encryption setting
  const APPLY_ENCRYPTION = process.env.APPLY_ENCRYPTION === 'true' || false;
  const { SECRET_KEY } = process.env;

  // If no input or not a string, return as is
  if (!encryptedInput || typeof encryptedInput !== 'string') {
    return encryptedInput;
  }

  // Check if decryption is enabled and secret_key is provided
  if (APPLY_ENCRYPTION && SECRET_KEY) {
    try {
 
      // Decrypt the data
      const decryptedText = decrypt(encryptedInput, SECRET_KEY);

      // Try to parse as JSON in case it was originally an object
      try {
        return JSON.parse(decryptedText);
      } catch (parseError) {
        // If not valid JSON, return as plain text
        return decryptedText;
      }
    } catch (error) {
      console.error('Error decrypting data:', error.message);
      // Return original input if decryption fails
      return encryptedInput;
    }
  }

  // Return the original input if decryption is not supported
  return encryptedInput;
};

module.exports = {
  getEncryptedText,
  decodeEncryptedText
};

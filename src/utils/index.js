const { encrypt } = require("../lib/crypto");

/**
 * Encrypts the provided input if encryption is enabled and a valid SECRET_KEY is provided.
 * @returns The original input if encryption is disabled, or an encrypted string if encryption is enabled.
 */
function getEncryptedText(input) {
  const APPLY_ENCRYPTION = false;

  // const APPLY_ENCRYPTION = process.env.APPLY_ENCRYPTION === 'true' || false;
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

module.exports = getEncryptedText;

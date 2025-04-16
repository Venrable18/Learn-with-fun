/**
 * Test script to demonstrate encryption and decryption
 * 
 * This script shows how to:
 * 1. Encrypt data using the same method as the server
 * 2. Send encrypted data to the server
 * 3. Receive and decrypt the server's response
 */

const crypto = require('crypto');
const axios = require('axios');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Constants for encryption (must match server settings)
const algorithm = "aes-256-gcm";
const iterations = 2145;
const keylen = 32;
const digest = "sha512";
const SECRET_KEY = process.env.SECRET_KEY;

/**
 * Encrypts data using the same method as the server
 */
function encrypt(data) {
  // Convert data to string if it's not already
  const dataString = typeof data === 'string' ? data : JSON.stringify(data);
  
  // Constants for encryption
  const inputEncoding = "utf8";
  const outputEncoding = "base64";

  // Generate random IV and salt
  const iv = crypto.randomBytes(12);
  const salt = crypto.randomBytes(16);

  // Derive key from secret
  const key = crypto.pbkdf2Sync(
    SECRET_KEY,
    salt,
    iterations,
    keylen,
    digest
  );

  // Create cipher and encrypt data
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const enc1 = cipher.update(dataString, inputEncoding);
  const enc2 = cipher.final();
  const tag = cipher.getAuthTag();

  // Combine all components into a single encrypted string
  const encryptedData = Buffer.concat([salt, iv, enc1, enc2, tag]).toString(outputEncoding);
  
  return encryptedData;
}

/**
 * Decrypts data using the same method as the server
 */
function decrypt(encryptedData) {
  // Constants for decryption
  const inputEncoding = "base64";
  const outputEncoding = "utf8";

  // Convert encrypted string to buffer
  const bufferData = Buffer.from(encryptedData, inputEncoding);

  // Extract components
  const salt = bufferData.subarray(0, 16);
  const iv = bufferData.subarray(16, 28);
  const encText = bufferData.subarray(28, bufferData.length - 16);
  const tag = bufferData.subarray(bufferData.length - 16);

  // Derive key using the same method
  const key = crypto.pbkdf2Sync(SECRET_KEY, salt, iterations, keylen, digest);

  // Create decipher and decrypt data
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  decipher.setAuthTag(tag);
  let decryptedBuffer = decipher.update(encText);
  decryptedBuffer = Buffer.concat([decryptedBuffer, decipher.final()]);

  // Convert buffer to string
  const decryptedText = decryptedBuffer.toString(outputEncoding);
  
  // Try to parse as JSON if possible
  try {
    return JSON.parse(decryptedText);
  } catch (e) {
    return decryptedText;
  }
}

/**
 * Test the encryption and decryption functionality
 */
async function testEncryption() {
  try {
    // Data to encrypt and send to server
    const testData = {
      name: "Test User",
      email: "test@example.com",
      message: "This is a test message"
    };
    
    console.log("Original data:", testData);
    
    // Encrypt the data
    const encryptedData = encrypt(testData);
    console.log("Encrypted data:", encryptedData);
    
    // Send encrypted data to server
    const response = await axios.post('http://localhost:5000/api/v1/home/decrypt-example', {
      data: encryptedData
    });
    
    console.log("Server response:", response.data);
    
    // If the server response is encrypted
    if (response.data && response.data.data) {
      // Decrypt the server's response
      const decryptedResponse = decrypt(response.data.data);
      console.log("Decrypted server response:", decryptedResponse);
    }
    
  } catch (error) {
    console.error("Error:", error.message);
    if (error.response) {
      console.error("Server response:", error.response.data);
    }
  }
}

// Run the test
testEncryption();

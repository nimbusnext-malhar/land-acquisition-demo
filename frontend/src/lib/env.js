/**
 * Environment variable validation utility
 * Ensures critical environment variables are set and validates their values
 */

const REQUIRED_ENV_VARS = ["REACT_APP_BACKEND_URL"];
const VALID_ENV_PATTERNS = {
  REACT_APP_BACKEND_URL: /^https?:\/\/.+/,
};

/**
 * Validate that all required environment variables are set and valid
 * @throws {Error} If required variables are missing or invalid
 */
export function validateEnvironment() {
  const missing = [];
  const invalid = [];

  for (const varName of REQUIRED_ENV_VARS) {
    const value = process.env[varName];

    if (!value) {
      missing.push(varName);
    } else if (VALID_ENV_PATTERNS[varName] && !VALID_ENV_PATTERNS[varName].test(value)) {
      invalid.push(`${varName} (invalid format)`);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}. ` +
      `Please check your .env file.`
    );
  }

  if (invalid.length > 0) {
    throw new Error(
      `Invalid environment variables: ${invalid.join(", ")}. ` +
      `Please check the format in your .env file.`
    );
  }
}

/**
 * Get a required environment variable with validation
 * @param {string} varName - The environment variable name
 * @returns {string} The environment variable value
 * @throws {Error} If the variable is not set
 */
export function getRequiredEnv(varName) {
  const value = process.env[varName];
  if (!value) {
    throw new Error(`Required environment variable not set: ${varName}`);
  }
  return value;
}

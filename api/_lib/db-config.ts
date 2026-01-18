// Secure database configuration
// Ensures DB_PASSWORD is set and provides consistent database configuration

export function getSecureDbConfig() {
  // CRITICAL: DB_PASSWORD must be set in Vercel environment variables
  const requiredEnvVars = ['DB_PASSWORD'];
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(
      `CRITICAL SECURITY ERROR: Missing required database environment variables: ${missingVars.join(', ')}. ` +
      `Database connections require explicit credentials - no fallbacks are provided for security.`
    );
  }

  if (!process.env.DB_PASSWORD || process.env.DB_PASSWORD.trim() === '') {
    throw new Error('CRITICAL SECURITY ERROR: DB_PASSWORD is empty');
  }

  const password = process.env.DB_PASSWORD;
  const host = process.env.DB_HOST || 'mindmeasure-aurora.cluster-cz8c8wq4k3ak.eu-west-2.rds.amazonaws.com';
  const port = parseInt(process.env.DB_PORT || '5432');
  const database = process.env.DB_NAME || 'mindmeasure';
  const user = process.env.DB_USERNAME || 'mindmeasure_admin';

  return {
    host,
    port,
    database,
    user,
    password,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 5000,
    query_timeout: 10000,
  };
}

export function getDbConnectionString(): string {
  const config = getSecureDbConfig();
  return `postgresql://${config.user}:${config.password}@${config.host}:${config.port}/${config.database}?sslmode=require`;
}

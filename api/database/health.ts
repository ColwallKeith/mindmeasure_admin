// API endpoint for database health check
// Vercel serverless function

import { VercelRequest, VercelResponse } from '@vercel/node';
// @ts-ignore - pg types not available in Vercel environment
import { Client } from 'pg';
import { getSecureDbConfig } from '../_lib/db-config';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Allow GET and POST requests
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const client = new Client(getSecureDbConfig());

  try {
    await client.connect();
    
    // Simple health check query
    const result = await client.query('SELECT version(), now() as current_time');
    
    const dbInfo = result.rows[0];
    
    res.status(200).json({
      status: 'healthy',
      database: {
        version: dbInfo.version,
        current_time: dbInfo.current_time,
        host: dbConfig.host,
        database: dbConfig.database
      },
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Aurora Serverless v2 health check error:', error);
    res.status(500).json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  } finally {
    await client.end();
  }
}

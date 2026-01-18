// API endpoint for database DELETE operations
// Vercel serverless function

import { VercelRequest, VercelResponse } from '@vercel/node';
// @ts-ignore - pg types not available in Vercel environment
import { Client } from 'pg';
import { getSecureDbConfig } from '../_lib/db-config';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { table, filters } = req.body;

  if (!table || !filters) {
    return res.status(400).json({ error: 'Table name and filters are required' });
  }

  const client = new Client(getSecureDbConfig());

  try {
    await client.connect();

    // Build DELETE query
    const whereConditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    // Build WHERE clause
    Object.entries(filters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        const placeholders = value.map(() => `$${paramIndex++}`).join(',');
        whereConditions.push(`${key} IN (${placeholders})`);
        params.push(...value);
      } else {
        whereConditions.push(`${key} = $${paramIndex++}`);
        params.push(value);
      }
    });

    const sql = `DELETE FROM ${table} WHERE ${whereConditions.join(' AND ')} RETURNING *`;

    console.log('Executing SQL:', sql, 'with params:', params);

    const result = await client.query(sql, params);

    res.status(200).json({
      data: result.rows,
      error: null,
      count: result.rowCount
    });

  } catch (error: any) {
    console.error('Database delete error:', error);
    res.status(500).json({
      data: null,
      error: error.message,
      count: 0
    });
  } finally {
    await client.end();
  }
}

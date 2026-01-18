import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Client } from 'pg';

// Extract base S3 URL from signed URL
function getBaseS3Url(signedUrl: string | null): string | null {
  if (!signedUrl) return null;
  
  // If it's already a clean URL (no query params or not S3), return as-is
  if (!signedUrl.includes('?') || !signedUrl.includes('s3')) {
    return signedUrl;
  }
  
  // Remove everything after the ?
  return signedUrl.split('?')[0];
}

const dbConfig = {
  host: process.env.VITE_DB_HOST || process.env.DB_HOST || 'mindmeasure-aurora.cluster-cz8c8wq4k3ak.eu-west-2.rds.amazonaws.com',
  port: parseInt(process.env.VITE_DB_PORT || process.env.DB_PORT || '5432'),
  database: process.env.VITE_DB_NAME || process.env.DB_NAME || 'mindmeasure',
  user: process.env.VITE_DB_USERNAME || process.env.DB_USERNAME || 'mindmeasure_admin',
  password: process.env.VITE_DB_PASSWORD || process.env.DB_PASSWORD,
  ssl: { rejectUnauthorized: false }
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { confirm, dryRun = true } = req.body;
  
  if (confirm !== 'FIX_URLS') {
    return res.status(400).json({ 
      error: 'Confirmation required',
      message: 'Send { "confirm": "FIX_URLS", "dryRun": false } to update database'
    });
  }

  const client = new Client(dbConfig);

  try {
    await client.connect();

    // 1. Get all universities with S3 URLs
    const result = await client.query(`
      SELECT id, name, logo, logo_dark, campus_image 
      FROM universities 
      WHERE logo IS NOT NULL OR logo_dark IS NOT NULL OR campus_image IS NOT NULL
    `);

    const updates: any[] = [];

    for (const uni of result.rows) {
      const newLogo = getBaseS3Url(uni.logo);
      const newLogoDark = getBaseS3Url(uni.logo_dark);
      const newCampusImage = getBaseS3Url(uni.campus_image);

      const hasChanges = 
        newLogo !== uni.logo || 
        newLogoDark !== uni.logo_dark || 
        newCampusImage !== uni.campus_image;

      if (hasChanges) {
        updates.push({
          id: uni.id,
          name: uni.name,
          before: {
            logo: uni.logo?.substring(0, 80) + '...',
            logo_dark: uni.logo_dark?.substring(0, 80) + '...',
            campus_image: uni.campus_image?.substring(0, 80) + '...'
          },
          after: {
            logo: newLogo,
            logo_dark: newLogoDark,
            campus_image: newCampusImage
          }
        });

        if (!dryRun) {
          await client.query(`
            UPDATE universities 
            SET logo = $1, logo_dark = $2, campus_image = $3, updated_at = NOW()
            WHERE id = $4
          `, [newLogo, newLogoDark, newCampusImage, uni.id]);
        }
      }
    }

    res.status(200).json({
      success: true,
      dryRun,
      message: dryRun ? 'Dry run - no changes made' : 'URLs updated successfully',
      universitiesChecked: result.rows.length,
      updatesNeeded: updates.length,
      updates
    });

  } catch (error: any) {
    console.error('❌ Error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      code: error.code
    });
  } finally {
    await client.end();
  }
}


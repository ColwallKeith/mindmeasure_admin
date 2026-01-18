import type { VercelRequest, VercelResponse } from '@vercel/node';
import { S3Client, PutBucketPolicyCommand, DeletePublicAccessBlockCommand } from '@aws-sdk/client-s3';

const BUCKET_NAME = 'mindmeasure-user-content-459338929203';
const REGION = 'eu-west-2';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Simple auth check
  const { confirm } = req.body;
  if (confirm !== 'MAKE_PUBLIC') {
    return res.status(400).json({ 
      error: 'Confirmation required',
      message: 'Send { "confirm": "MAKE_PUBLIC" } to proceed'
    });
  }

  try {
    const s3Client = new S3Client({ region: REGION });

    // 1. Remove public access block
    console.log('🔓 Removing public access block...');
    await s3Client.send(new DeletePublicAccessBlockCommand({
      Bucket: BUCKET_NAME
    }));
    console.log('✅ Public access block removed');

    // 2. Set bucket policy for public read
    const bucketPolicy = {
      Version: '2012-10-17',
      Statement: [
        {
          Sid: 'PublicReadForUniversityAssets',
          Effect: 'Allow',
          Principal: '*',
          Action: 's3:GetObject',
          Resource: `arn:aws:s3:::${BUCKET_NAME}/*`
        }
      ]
    };

    console.log('📋 Setting bucket policy for public read...');
    await s3Client.send(new PutBucketPolicyCommand({
      Bucket: BUCKET_NAME,
      Policy: JSON.stringify(bucketPolicy)
    }));
    console.log('✅ Bucket policy set');

    res.status(200).json({
      success: true,
      message: `Bucket ${BUCKET_NAME} is now publicly readable`,
      bucketPolicy
    });

  } catch (error: any) {
    console.error('❌ Error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      code: error.code
    });
  }
}


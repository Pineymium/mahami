import { list } from '@vercel/blob';

export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  try {
    const { blobs } = await list();
    
    // Sort by upload date (newest first)
    const sortedBlobs = blobs.sort((a, b) => 
      new Date(b.uploadedAt) - new Date(a.uploadedAt)
    );
    
    return new Response(JSON.stringify({ 
      success: true,
      files: sortedBlobs.map(blob => ({
        url: blob.url,
        downloadUrl: blob.downloadUrl,
        pathname: blob.pathname,
        uploadedAt: blob.uploadedAt,
        size: blob.size
      }))
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('List error:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

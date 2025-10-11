export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
 res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version')

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }
  if (req.method === 'POST') {
    // Return a mock order confirmation
    const orderConfirmation = {
      id: Math.floor(Math.random() * 10000),
      createdAt: new Date().toISOString(),
      status: 'confirmed'
    };
    
    res.status(200).json(orderConfirmation);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

export const config = {
  runtime: 'edge',
}
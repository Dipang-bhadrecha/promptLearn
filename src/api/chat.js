// api/chat.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('🔍 Proxy received request:', req.body);

  try {
    const response = await fetch('http://ec2-13-233-158-206.ap-south-1.compute.amazonaws.com:3003/api/chat', {
    // const response = await fetch(`${API_BASE}/api/chat`, {
      
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(req.body),
      credentials: 'include',
    });

    console.log('🌐 AWS Response Status:', response.status, response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ AWS Backend Error:', errorText);
      throw new Error(`AWS backend error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    // 🔍 LOG THE ACTUAL RESPONSE FORMAT
    console.log('📦 AWS Response Data:', JSON.stringify(data, null, 2));
    
    res.status(200).json(data);
  } catch (error) {
    console.error('💥 Proxy Error:', error.message);
    res.status(500).json({ 
      error: 'Backend connection failed',
      details: error.message 
    });
  }
}

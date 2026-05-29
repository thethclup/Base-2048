export default async function handler(req, res) {
  // Add CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      name: "Base2048 Orchestrator",
      description: "Master strategist of 2048 tile merging and endless gameplay",
      status: "active",
      wallet: "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6",
      platform: "Base2048",
      version: "1.0.0",
      type: "ERC-8004 Agent",
      lastUpdated: new Date().toISOString()
    });
  }

  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      return res.status(200).json({
        status: "success",
        message: "Agent endpoint active",
        received: body
      });
    } catch (err) {
      return res.status(400).json({
        status: "error",
        message: "Invalid request"
      });
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({
      protocol: "MCP",
      version: "1.0.0",
      name: "Base2048 MCP Endpoint",
      status: "active",
      description: "Active MCP server",
      capabilities: ["2048-mechanics", "tile-merging-automation", "score-maximization"],
      timestamp: new Date().toISOString()
    });
  }

  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { action, command, params, task, method } = body || {};

      const cmd = (method || action || command || task || "").toLowerCase();

      let result = {};

      switch (cmd) {
        case "status":
        case "ping":
          result = { 
            status: "online", 
            agent: "Base2048 Orchestrator",
            message: "Board is ready - Let's merge!" 
          };
          break;

        case "tools/list":
          result = {
            tools: [
              { name: "get_race_status", description: "Get current race status", inputSchema: { type: "object", properties: {} } },
              { name: "start_race", description: "Start the race", inputSchema: { type: "object", properties: {} } },
              { name: "get_leaderboard", description: "Get leaderboard", inputSchema: { type: "object", properties: {} } },
              { name: "optimize_speed", description: "Optimize speed", inputSchema: { type: "object", properties: {} } },
              { name: "get_track_info", description: "Get track info", inputSchema: { type: "object", properties: {} } }
            ]
          };
          break;

        case "prompts/list":
          result = { prompts: [] };
          break;

        case "resources/list":
          result = { resources: [] };
          break;

        case "tools/call":
        case "execute":
          result = {
            success: true,
            executed: params || command,
            executedAt: new Date().toISOString(),
            message: "Move/Tool executed successfully"
          };
          break;

        case "get_info":
          result = {
            name: "Base2048 Orchestrator",
            wallet: "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6",
            platform: "Base",
            version: "1.0.0"
          };
          break;

        default:
          result = {
            success: true,
            message: "Command received",
            data: body
          };
      }

      // Add CORS Headers if needed
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

      return res.status(200).json({
        status: "success",
        agent: "Base2048 Orchestrator",
        response: result,
        receivedAt: new Date().toISOString()
      });
    } catch (error) {
      return res.status(400).json({
        status: "error",
        message: "Failed to process command"
      });
    }
  }

  // Handle OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}

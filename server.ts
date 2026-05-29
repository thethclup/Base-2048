import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  
  // Base2048 Orchestrator - Agent Info Endpoint
  app.get("/api/agent", (req, res) => {
    res.json({
      name: "Base2048 Orchestrator",
      description: "Master strategist of 2048 tile merging and endless gameplay",
      status: "active",
      wallet: "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6",
      platform: "Base2048",
      version: "1.0.0",
      type: "ERC-8004 Agent",
      lastUpdated: new Date().toISOString()
    });
  });

  // MCP Endpoint
  app.get("/api/mcp", (req, res) => {
    res.json({
      protocol: "MCP",
      version: "1.0.0",
      name: "Base2048 MCP Endpoint",
      status: "active",
      description: "Active MCP server for Base2048 Orchestrator",
      capabilities: ["2048-mechanics", "tile-merging-automation", "score-maximization"],
      timestamp: new Date().toISOString()
    });
  });

  app.post("/api/mcp", (req, res) => {
    try {
      const body = req.body || {};
      
      const isJsonRpc = body.jsonrpc === "2.0" || 'id' in body;
      const cmd = (body.method || body.action || body.command || body.task || "").toLowerCase();

      let result: any = {};

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
            content: [
              { type: "text", text: "Move/Tool executed successfully" }
            ]
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

      if (isJsonRpc || body.method) {
        res.json({
          jsonrpc: "2.0",
          id: body.id || 1,
          result: result
        });
      } else {
        res.json({
          status: "success",
          agent: "Base2048 Orchestrator",
          response: result,
          receivedAt: new Date().toISOString()
        });
      }

    } catch (error) {
      res.status(400).json({
        status: "error",
        message: "Failed to process 2048 command"
      });
    }
  });


  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // In production, express.static is configured to serve dist path
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

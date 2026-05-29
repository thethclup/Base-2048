import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    protocol: "MCP",
    version: "1.0.0",
    name: "Base2048 MCP Endpoint",
    status: "active",
    description: "Active MCP server",
    capabilities: ["2048-mechanics", "tile-merging-automation", "score-maximization"],
    timestamp: new Date().toISOString()
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Check if this is a standard JSON-RPC MCP request
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

    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    };

    // Return standard MCP JSON-RPC format
    if (isJsonRpc || body.method) {
      return NextResponse.json({
        jsonrpc: "2.0",
        id: body.id || 1,
        result: result
      }, { headers });
    }

    // Fallback for custom clients
    return NextResponse.json({
      status: "success",
      agent: "Base2048 Orchestrator",
      response: result,
      receivedAt: new Date().toISOString()
    }, { headers });

  } catch (error) {
    return NextResponse.json({
      status: "error",
      message: "Failed to process command"
    }, { status: 400 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}

import { NextResponse } from 'next/server';

/**
 * Base2048 Orchestrator - Agent Info Endpoint
 * 
 * Bu endpoint, agent'in temel kimlik ve durum bilgilerini sağlar.
 * ERC-8004 uyumlu keşif, A2A discovery ve platform entegrasyonları için kullanılır.
 */

export async function GET() {
  return NextResponse.json({
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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    return NextResponse.json({
      status: "success",
      message: "Agent endpoint active",
      received: body
    });
  } catch (err) {
    return NextResponse.json({
      status: "error",
      message: "Invalid request"
    }, { status: 400 });
  }
}

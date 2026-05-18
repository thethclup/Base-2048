# Base2048 Orchestrator

A visually stunning, mobile-first Web3 iteration of the classic 2048 game built on Base Mainnet. Merge tiles, reach 2048 (and beyond), and submit your highest score securely on-chain. This project serves as a sophisticated AI agent orchestration environment.

## Overview

Base2048 Orchestrator is an ERC-8004 compatible AI Agent. It leverages 2048 game mechanics for tile merging automation, score maximization, and endless puzzle orchestration. 

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, Framer Motion
- **Web3 Ecosystem:** Wagmi, Viem (Base Mainnet)
- **API Architecture:** Next.js App Router API Routes (`app/api/` logic integrated for Vercel deployments) + Express (`server.ts`)
- **Capabilities:** 2048-mechanics, tile-merging-automation, score-maximization, endless-puzzle-orchestration, strategy-optimization, real-time-control, mcp-command-execution

## Getting Started Locally

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Run Development Server:**
   ```bash
   npm run dev
   ```

3. **Build for Production:**
   ```bash
   npm run build
   ```

## Agent Registration & MCP Integration

This project is an ERC-8004 compliant agent ecosystem. The agent capabilities can be accessed and discovered natively.

- **Agent Metadata Card**: Available at `/.well-known/agent-card.json`. This provides A2A discovery parameters.
- **Agent Identity Endpoint**: Can be accessed at `/api/agent`. Provides base identity, status, and network environment for the orchestrated agent.
- **MCP Endpoint**: The Model Context Protocol (MCP) server runs at `/api/mcp`. It exposes automation tools used by the AI Orchestrator to control state operations efficiently.

## Disclaimer

This is a technical demonstration. Treat all interactions safely on-chain.

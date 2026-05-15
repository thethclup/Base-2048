# Base2048

A visually stunning, mobile-first Web3 iteration of the classic 2048 game built on Base Mainnet. Merge tiles, reach 2048 (and beyond), and submit your highest score securely on-chain.

## Features

- **Classic 2048 Mechanics:** Swipe to slide tiles and merge identical numbers.
- **Mobile First Design:** Fully responsive layout with smooth touch controls.
- **Web3 Integrations:**
  - Connect your wallet to play.
  - Submit transactions on the Base Mainnet.
  - Hybrid Leaderboard and Achievements (Powered by SIWE).
- **ERC-8004 AI Agent:** Includes configuration for "Base2048 Orchestrator", a smart agent to automate and optimize tile merging strategies.
- **Premium Aesthetics:** Dark/neon aesthetic with satisfying animations and dynamic glowing tiles.

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, Framer Motion
- **Web3:** Wagmi, Viem (Base Mainnet)
- **Backend / MCP Server:** Express (providing Agent and MCP API endpoints)

## Setup and Development

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

## Agent Integration

Base2048 acts as a playground and controller for decentralized AI orchestration. Check the agent's definition at `.well-known/agent-card.json` and interact with the AI logic through the API endpoints such as `/api/mcp` and `/api/agent`.

import { useAccount, useConnect, useDisconnect, useSendTransaction } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { parseEther, stringToHex } from 'viem';
import { ERC8021 } from '../lib/erc8021';
import { ERC8004 } from '../lib/erc8004';
import { useState } from 'react';

export const Web3Connect = () => {
  const { address, isConnected } = useAccount();
  const { connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <div className="flex items-center gap-3">
        <div className="px-3 py-1 bg-[var(--card)] border border-[var(--border)] rounded-full text-xs font-mono text-[var(--color-base-blue)] glow-base">
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </div>
        <button 
          onClick={() => disconnect()}
          className="text-xs text-gray-500 hover:text-white transition-colors"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => connect({ connector: injected() })}
      disabled={isPending}
      className="px-4 py-1.5 bg-[#0052ff] hover:bg-[#0040cc] text-white rounded-full text-sm font-semibold transition-all glow-base disabled:opacity-50"
    >
      {isPending ? 'Connecting...' : 'Connect Wallet'}
    </button>
  );
};

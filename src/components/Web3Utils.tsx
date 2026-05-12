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

export const SayGMButton = () => {
  const { isConnected } = useAccount();
  const { sendTransaction, isPending } = useSendTransaction();
  const [status, setStatus] = useState<string | null>(null);

  const handleSayGM = () => {
    ERC8021.trackAttribution();
    if (!isConnected) {
      alert("Please connect wallet first!");
      return;
    }
    
    // Simple 0-value transaction as a "Say GM" proof on-chain
    // In a real app we might call a specific contract. Here we send 0 ETH to ourselves
    sendTransaction({
      to: '0x0000000000000000000000000000000000000000', // Burn/dummy address
      value: parseEther('0'),
      data: stringToHex('Say GM from Base 2048')
    }, {
      onSuccess: () => {
        setStatus('GM transaction submitted!');
        setTimeout(() => setStatus(null), 3000);
      },
      onError: (e) => {
        setStatus(`Error: ${e.message.slice(0,20)}...`);
        setTimeout(() => setStatus(null), 3000);
      }
    });
  };

  return (
    <div className="flex flex-col items-center">
      <button 
        onClick={handleSayGM}
        disabled={isPending}
        className="px-6 py-3 bg-[var(--card)] border border-[var(--color-base-blue)] rounded-xl text-[var(--color-base-blue)] font-bold hover:bg-[var(--color-base-blue)] hover:text-white transition-all disabled:opacity-50"
      >
        {isPending ? 'Sending Tx...' : 'Say GM (On-chain)'}
      </button>
      {status && <span className="text-xs text-gray-400 mt-2">{status}</span>}
    </div>
  );
};

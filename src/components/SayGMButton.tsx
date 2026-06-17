import { useState } from 'react';
import { useSendCalls, useSendTransaction, useAccount } from 'wagmi';
import { parseEther, stringToHex, concatHex, toHex } from 'viem';
import { ERC8021 } from '../lib/erc8021';
import { Sun } from 'lucide-react';
import { useCapabilities } from 'wagmi';
import { base } from 'wagmi/chains';
import { useMemo } from 'react';

export function useWalletCapabilities() {
  const { data: capabilities } = useCapabilities();

  const supportsBatching = useMemo(() => {
    const atomic = capabilities?.[base.id]?.atomic;
    return atomic?.status === 'ready' || atomic?.status === 'supported';
  }, [capabilities]);

  return { supportsBatching };
}

export function SayGMButton() {
  const { isConnected } = useAccount();
  const { supportsBatching } = useWalletCapabilities();

  if (!isConnected) return null;

  return supportsBatching ? <BatchFlow /> : <SequentialFlow />;
}

// Prepare the base options
const baseData = stringToHex('GM');
const builderCode = ERC8021.ATTRIBUTION_CODE !== '[ATTRIBUTION_CODE]' ? ERC8021.ATTRIBUTION_CODE : '[BUILDER_CODE]';

// For EOA we concat the suffix manually since it does not support dataSuffix capability
// Using toHex wrapper since we want standard values
const builderHex = stringToHex(builderCode);
const erc8021Suffix = '0x8021802180218021802180218021802180218021802180218021802180218021';
const eoaFinalData = concatHex([baseData, builderHex, erc8021Suffix]);

const baseTx = {
  to: '0xc35B9997B63B1CE14f8F513f7eddD9a7ABbB33d7' as const,
  value: parseEther('0'),
};

function BatchFlow() {
  const { sendCalls, isPending } = useSendCalls();
  const [txStatus, setTxStatus] = useState<string | null>(null);

  const handleSayGM = () => {
    ERC8021.trackAttribution();
    
    // For smart wallets, we send baseData and use dataSuffix to handle attribution automatically.
    // However, the value of dataSuffix must include our encoded builder code too!
    // We pass our builderHex + suffix as the capability
    const dataSuffixValue = concatHex([builderHex, erc8021Suffix]);
    
    sendCalls({
      calls: [{
        ...baseTx,
        data: baseData
      }],
      capabilities: {
        dataSuffix: {
          value: concatHex([builderHex, erc8021Suffix]),
          optional: true
        }
      }
    }, {
      onSuccess: () => {
        setTxStatus('GM batch call submitted via Base Account!');
        setTimeout(() => setTxStatus(null), 3000);
      },
      onError: (e) => {
        setTxStatus(`Error: ${e.message.slice(0, 20)}...`);
        setTimeout(() => setTxStatus(null), 3000);
      }
    });
  };

  return (
    <div className="flex flex-col items-center">
      <button 
        onClick={handleSayGM}
        disabled={isPending}
        className="px-3 py-2 rounded-lg bg-[#E8A020]/20 hover:bg-[#E8A020]/30 border border-[#E8A020]/40 text-[#E8A020] transition-colors flex items-center gap-2 font-['Cinzel'] text-xs font-bold"
      >
        <Sun size={16} />
        {isPending ? 'Sending...' : 'Say GM'}
      </button>
      {txStatus && <span className="text-xs text-gray-400 mt-2">{txStatus}</span>}
    </div>
  );
}

function SequentialFlow() {
  const { sendTransaction, isPending } = useSendTransaction();
  const [txStatus, setTxStatus] = useState<string | null>(null);

  const handleSayGM = () => {
    ERC8021.trackAttribution();
    
    sendTransaction({
      ...baseTx,
      data: eoaFinalData
    }, {
      onSuccess: () => {
        setTxStatus('GM transaction submitted!');
        setTimeout(() => setTxStatus(null), 3000);
      },
      onError: (e) => {
        setTxStatus(`Error: ${e.message.slice(0, 20)}...`);
        setTimeout(() => setTxStatus(null), 3000);
      }
    });
  };

  return (
    <div className="flex flex-col items-center">
      <button 
        onClick={handleSayGM}
        disabled={isPending}
        className="px-3 py-2 rounded-lg bg-[#E8A020]/20 hover:bg-[#E8A020]/30 border border-[#E8A020]/40 text-[#E8A020] transition-colors flex items-center gap-2 font-['Cinzel'] text-xs font-bold"
      >
        <Sun size={16} />
        {isPending ? 'Sending...' : 'Say GM'}
      </button>
      {txStatus && <span className="text-xs text-gray-400 mt-2">{txStatus}</span>}
    </div>
  );
}

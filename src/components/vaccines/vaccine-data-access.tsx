'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { useQuery } from '@tanstack/react-query';
import { PublicKey } from '@solana/web3.js';

type TokenAccount = {
  mint: string;
  amount: number;
  isMintAuthority: boolean;
  metadata?: {
    name?: string;
    symbol?: string;
    decimals: number;
    uri?: string;
  };
};

type WalletContextType = {
  tokens: TokenAccount[];
  isLoading: boolean;
  error: string | null;
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  const { data, isLoading, error } = useQuery({
    queryKey: ['get-wallet-tokens', { publicKey }],
    queryFn: async () => {
      if (!publicKey) return [];

      // Obtenha todas as contas de token associadas à carteira
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
        programId: TOKEN_PROGRAM_ID,
      });

      const filteredAccounts = await Promise.all(
        tokenAccounts.value.map(async (account) => {
          const accountData = account.account.data.parsed.info;
          const mint = new PublicKey(accountData.mint);
          const amount = parseInt(accountData.tokenAmount.amount, 10);
          const decimals = accountData.tokenAmount.decimals;

          // Verifica se o usuário é o Mint Authority
          const mintInfo = await connection.getParsedAccountInfo(mint);
          const mintData = mintInfo.value?.data?.parsed?.info;
          const isMintAuthority = mintData?.mintAuthority === publicKey.toString();

          // Exclui tokens com decimais diferentes de zero
          if (decimals !== 0) return null;

          return {
            mint: mint.toString(),
            amount,
            isMintAuthority,
            metadata: {
              name: accountData.tokenAmount.name || 'Unknown Token',
              symbol: accountData.tokenAmount.symbol || 'N/A',
              decimals,
              uri: accountData.tokenAmount.uri || undefined,
            },
          };
        })
      );

      return filteredAccounts.filter(Boolean) as TokenAccount[];
    },
  });

  const value = useMemo(
    () => ({
      tokens: data || [],
      isLoading,
      error: error ? String(error) : null,
    }),
    [data, isLoading, error]
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWalletData() {
  const context = useContext(WalletContext);

  if (!context) {
    throw new Error('useWalletData deve ser usado dentro de um WalletProvider');
  }

  return context;
}

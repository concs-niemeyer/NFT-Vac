"use client";

import { Key, useState, useEffect } from "react";
import { useWalletData } from "./vaccine-data-access";

export const VaccineTokens = () => {
  const { tokens, isLoading, error } = useWalletData();

  // Estado local para armazenar os dados detalhados dos tokens
  const [detailedTokens, setDetailedTokens] = useState<any[]>([]);

  useEffect(() => {
    // Atualiza o estado local quando os tokens são carregados
    if (!isLoading && tokens.length > 0) {
      setDetailedTokens(tokens);
    }
  }, [tokens, isLoading]);

  if (isLoading) {
    return <p>Carregando tokens...</p>;
  }

  if (error) {
    console.error("Erro ao carregar os tokens:", error);
    return <p>Erro ao carregar tokens.</p>;
  }

  if (!detailedTokens || detailedTokens.length === 0) {
    console.log("Nenhum token encontrado na carteira.");
    return <p>Nenhum token encontrado.</p>;
  }

  console.log("Tokens carregados com sucesso:", detailedTokens);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {detailedTokens.map((token: { mint: Key | null | undefined; metadata: { name: any; symbol: any; decimals: any; uri: string | undefined; }; amount: bigint; }) => {
        console.log("Detalhes do token:", token);

        // Conversão explícita para evitar o erro do BigInt
        const amount = Number(token.amount) / Math.pow(10, token.metadata?.decimals || 0);

        return (
          <div key={token.mint} className="card">
            <h3>{token.metadata?.name || "Token Name"}</h3>
            <p>Symbol: {token.metadata?.symbol || "N/A"}</p>
            <p>Quantidade: {amount}</p>
            {token.metadata?.uri && (
              <a href={token.metadata.uri} target="_blank" rel="noopener noreferrer">
                Ver mais detalhes
              </a>
            )}
          </div>
        );
      })}
    </div>
  );
}

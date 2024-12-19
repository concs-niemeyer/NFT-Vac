"use client";

import { useState, useEffect } from "react";
import { VaccineTokens } from "./vaccine-ui";
import { useWalletData } from "./vaccine-data-access";

export default function VaccineFeature() {
  const { tokens, isLoading, error } = useWalletData();
  const [filteredTokens, setFilteredTokens] = useState(tokens || []);

  // Atualiza os tokens filtrados sempre que os tokens originais mudarem
  useEffect(() => {
    if (tokens) {
      setFilteredTokens(tokens);
    }
  }, [tokens]);

  if (isLoading) return <p>Carregando tokens...</p>;

  if (error) {
    console.error("Erro ao carregar os tokens:", error);
    return <p>Erro ao carregar tokens.</p>;
  }

  if (!filteredTokens || filteredTokens.length === 0) {
    console.log("Nenhum token encontrado na carteira.");
    return <p>Nenhum token encontrado.</p>;
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchQuery = e.target.value.toLowerCase();
    const filtered = tokens.filter((token) =>
      token.metadata?.name.toLowerCase().includes(searchQuery)
    );
    setFilteredTokens(filtered);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar por nome do token..."
          className="input input-bordered w-full"
          onChange={handleSearch}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {filteredTokens.map((token) => (
          <div key={token.mint} className="card">
            <h3>{token.metadata?.name || "Token Name"}</h3>
            <p>Symbol: {token.metadata?.symbol || "N/A"}</p>
            <p>
              Amount:{" "}
              {Number(token.amount)}
            </p>
            {token.metadata?.uri && (
              <a
                href={token.metadata.uri}
                target="_blank"
                rel="noopener noreferrer"
              >
                Ver mais detalhes
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

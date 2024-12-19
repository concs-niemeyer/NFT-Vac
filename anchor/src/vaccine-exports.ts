// Importações essenciais para trabalhar com o Anchor e Solana
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { Cluster, PublicKey } from '@solana/web3.js';
import VaccineIDL from '../target/idl/vaccination_nft.json';
import type { VaccinationNft as Vaccine } from '../target/types/vaccination_nft';

// Reexporta a interface gerada e o IDL
export { Vaccine, VaccineIDL };

// O programId é definido com base no endereço fornecido no IDL
export const VACCINE_PROGRAM_ID = new PublicKey("84TPC1JQcqtPdADuq6nw2vyvtvM4zL6pkxmSMkm1e84W");

// Função auxiliar para obter o programa Anchor do Cartão de Vacinação
export function getVaccineProgram(provider: AnchorProvider): Program<Vaccine> {
  // Retorna o programa Anchor com tipagem explícita
  return new Program(VaccineIDL as Vaccine, provider);
}

export function getVaccineProgramId(cluster: Cluster) {
	switch(cluster) {
		case "devnet":
    case "testnet":
    case "mainnet-beta":
    default:
      return VACCINE_PROGRAM_ID;
  }
}
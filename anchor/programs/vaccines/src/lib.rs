use anchor_lang::prelude::*;

declare_id!("84TPC1JQcqtPdADuq6nw2vyvtvM4zL6pkxmSMkm1e84W");

#[program]
pub mod vaccination_nft {

    use super::*;

    pub fn atualizar_vacinas(ctx: Context<AtualizarVacinas>, vacina_info: VacinaInfo) -> Result<()> {
        let nft_account = &mut ctx.accounts.nft_account;

        // Verifique se quem está atualizando é o proprietário do NFT
        require_keys_eq!(nft_account.owner, ctx.accounts.owner.key(), ErrorCode::NaoAutorizado);

        // Atualize o histórico de vacinas
        nft_account.vacinas.push(vacina_info);

        Ok(())
    }

    pub fn mint_nft(ctx: Context<MintNFT>, metadados: Metadata) -> Result<()> {
        let nft_account = &mut ctx.accounts.nft_account;

        // Assegure que o NFT só pode ser utilizado pelo proprietário
        nft_account.owner = ctx.accounts.owner.key();
        nft_account.metadata = metadados;
        nft_account.is_transferable = false; // Bloqueia transferências

        Ok(())
    }

}

#[derive(Accounts)]
pub struct MintNFT<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,

    #[account(
        init,
        payer = owner,
        space = 8 + 1024,
        seeds = [b"nft", owner.key().as_ref()],
        bump
    )]
    pub nft_account: Account<'info, NFTAccount>,

    pub system_program: Program<'info, System>,
}

#[account]
pub struct NFTAccount {
    pub owner: Pubkey,
    pub metadata: Metadata,
    pub is_transferable: bool,
    pub vacinas: Vec<VacinaInfo>,
    pub bump: u8, // Adicionado para armazenar o bump do PDA
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct Metadata {
    pub name: String,
    pub uri: String,
    pub symbol: String,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct VacinaInfo {
    pub dose: String,              // Exemplo: "1ª Dose"
    pub data: String,              // Exemplo: "2024-01-10"
    pub fabricante: String,        // Exemplo: "Pfizer"
}

#[derive(Accounts)]
pub struct AtualizarVacinas<'info> {
    #[account(mut, has_one = owner, seeds = [b"nft", owner.key().as_ref()], bump = nft_account.bump)]
    pub nft_account: Account<'info, NFTAccount>,  // Conta do NFT
    pub owner: Signer<'info>,                     // Proprietário do NFT
}

#[error_code]
pub enum ErrorCode {
    #[msg("Você não está autorizado a realizar esta ação.")]
    NaoAutorizado,
    #[msg("Esta dose já foi registrada.")]
    DoseDuplicada,
    #[msg("Os metadados fornecidos são inválidos.")]
    MetadadosInvalidos,
}

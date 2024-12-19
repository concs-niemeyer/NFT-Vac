/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/vaccination_nft.json`.
 */
export type VaccinationNft = {
  "address": "84TPC1JQcqtPdADuq6nw2vyvtvM4zL6pkxmSMkm1e84W",
  "metadata": {
    "name": "vaccinationNft",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "atualizarVacinas",
      "discriminator": [
        131,
        213,
        34,
        45,
        135,
        66,
        207,
        75
      ],
      "accounts": [
        {
          "name": "nftAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  110,
                  102,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "owner"
              }
            ]
          }
        },
        {
          "name": "owner",
          "signer": true,
          "relations": [
            "nftAccount"
          ]
        }
      ],
      "args": [
        {
          "name": "vacinaInfo",
          "type": {
            "defined": {
              "name": "vacinaInfo"
            }
          }
        }
      ]
    },
    {
      "name": "mintNft",
      "discriminator": [
        211,
        57,
        6,
        167,
        15,
        219,
        35,
        251
      ],
      "accounts": [
        {
          "name": "owner",
          "writable": true,
          "signer": true
        },
        {
          "name": "nftAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  110,
                  102,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "owner"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "metadados",
          "type": {
            "defined": {
              "name": "metadata"
            }
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "nftAccount",
      "discriminator": [
        45,
        29,
        251,
        53,
        216,
        110,
        121,
        151
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "naoAutorizado",
      "msg": "Você não está autorizado a realizar esta ação."
    },
    {
      "code": 6001,
      "name": "doseDuplicada",
      "msg": "Esta dose já foi registrada."
    },
    {
      "code": 6002,
      "name": "metadadosInvalidos",
      "msg": "Os metadados fornecidos são inválidos."
    }
  ],
  "types": [
    {
      "name": "metadata",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "uri",
            "type": "string"
          },
          {
            "name": "symbol",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "nftAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "metadata",
            "type": {
              "defined": {
                "name": "metadata"
              }
            }
          },
          {
            "name": "isTransferable",
            "type": "bool"
          },
          {
            "name": "vacinas",
            "type": {
              "vec": {
                "defined": {
                  "name": "vacinaInfo"
                }
              }
            }
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "vacinaInfo",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "dose",
            "type": "string"
          },
          {
            "name": "data",
            "type": "string"
          },
          {
            "name": "fabricante",
            "type": "string"
          }
        ]
      }
    }
  ]
};

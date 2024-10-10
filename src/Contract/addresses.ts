import { ChainID } from './chains';

export interface AddressMap {
  [cid:number]:`0x${string}`
}

export const USDT_ADDRESSSES:AddressMap = {
  [ChainID.BSC]: "0x55d398326f99059fF775485246999027B3197955",
};

export const TOX_ADDRESSSES:AddressMap = {
  [ChainID.BSC]: "0x3eE243ff68074502b1D9D65443fa97b99f634570",
};

export const TEST_CONTRACT_ADDRESSSES:AddressMap = {
  [ChainID.BSC]: "0x904AF34F01D3bA83923557A453615EFa1CBD06Ca",
};
export const DOVART_CONTRACT_ADDRESSSES:AddressMap = {
  [ChainID.BSC]: "0x2F295157735f9D7C53b2bE8Ff58F47AC63666861",
};


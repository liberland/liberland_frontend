import { ethers, Contract } from 'ethers';
import { decodeAddress } from '@polkadot/keyring';

import BridgeABI from "../assets/abis/Bridge.json";

export const ASSETS = ["LLM", "LLD"];
export const ADDRESSES = {
    LLM: process.env.REACT_APP_LLM_BRIDGE,
    LLD: process.env.REACT_APP_LLD_BRIDGE,
};

let __provider;
const _getProvider = async () => {
    if (!__provider) {
        __provider = new ethers.providers.Web3Provider(window.ethereum);
        const chainId = '0x'+parseInt(process.env.REACT_APP_ETHER_CHAIN_ID).toString(16);
        await __provider.provider.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId }],
        });

        __provider.on("network", (newNetwork, oldNetwork) => {
            if (oldNetwork) {
                window.location.reload();
            }
        });
    }
    return __provider;
}

const _getContract = async (addr) => {
    const provider = await _getProvider();
    const signer = provider.getSigner();
    return new Contract(addr, BridgeABI.abi, signer);
}

const _getReceipts = async (contract_address, user_address) => {
    const contract = await _getContract(contract_address);
    const filter = contract.filters.OutgoingReceipt(user_address, null);
    const events = await contract.queryFilter(filter);
    return await Promise.all(events.map(async (event) => ({
        ...event,
        blockTimestamp: (await event.getBlock()).timestamp
    })));
}

export const getEthereumOutgoingReceipts = async (user_address) => {
    let res = {};
    await Promise.all(ASSETS.map(async (a) => {
        res[a] = await _getReceipts(ADDRESSES[a], user_address);
    }));
    return res;
}

export const bridgeBurn = async ({ asset, amount, substrateRecipient }) => {
    const contract = await _getContract(ADDRESSES[asset]);
    const account_id = decodeAddress(substrateRecipient);
    const { hash: txHash } = await contract.burn(amount, account_id);
    return txHash;
}

export const getTxReceipt = async ({ txHash }) => {
    const provider = await _getProvider();
    return await provider.waitForTransaction(txHash);
}
import { useCall, useEthers, useToken, useTokenBalance } from "@usedapp/core";
import { Contract } from "ethers";
import BridgeABI from "../assets/abis/Bridge.json";

export const ASSETS = ["LLM", "LLD"];
const ADDRESSES = {
    LLM: process.env.REACT_APP_LLM_BRIDGE,
    LLD: process.env.REACT_APP_LLD_BRIDGE,
};

function useEthBridge(asset) {
    // FIXME pass this through redux?
    const { account } = useEthers();
    const contract = asset && new Contract(ADDRESSES[asset], BridgeABI.abi);

    // FIXME replace with useCalls
    const { value: tokenAddress } = useCall(contract && { contract, method: 'token', args: [] }) ?? {};
    const { value: mintDelay } = useCall(contract && { contract, method: 'mintDelay', args: [] }) ?? {};
    const { value: mintFee } = useCall(contract && { contract, method: 'fee', args: [] }) ?? {};

    const token = useToken(tokenAddress && tokenAddress[0]);
    const balance = useTokenBalance(tokenAddress && tokenAddress[0], account);


    return balance && token && mintDelay && mintFee && [asset, {
        asset,
        contract,
        token,
        balance,
        mintDelay: mintDelay[0],
        mintFee: mintFee[0],
    }];
}

export function useEthBridges() {
    const bridges = ASSETS.map(useEthBridge);
    if (bridges.some(bridge => !bridge)) return null; // still loading
    return Object.fromEntries(bridges);
}
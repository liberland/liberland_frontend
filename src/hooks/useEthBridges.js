import { useCall, useEthers, useToken, useTokenBalance } from "@usedapp/core";
import { Contract } from "ethers";
import BridgeABI from "../assets/abis/Bridge.json";
import { ASSETS, ADDRESSES } from "../api/eth";

function useEthBridge(asset) {
    // FIXME pass this through redux?
    const { account } = useEthers();
    const contract = asset && new Contract(ADDRESSES[asset], BridgeABI.abi);

    // FIXME replace with useCalls
    const { value: tokenAddress } = useCall(contract && { contract, method: 'token', args: [] }) ?? {};
    const { value: mintDelay } = useCall(contract && { contract, method: 'mintDelay', args: [] }) ?? {};
    const { value: mintFee } = useCall(contract && { contract, method: 'fee', args: [] }) ?? {};
    const { value: minTransfer } = useCall(contract && { contract, method: 'minTransfer', args: [] }) ?? {};

    const token = useToken(tokenAddress && tokenAddress[0]);
    const balance = useTokenBalance(tokenAddress && tokenAddress[0], account);

    return balance && token && mintDelay && mintFee && minTransfer && [asset, {
        asset,
        contract,
        token,
        balance,
        mintDelay: mintDelay[0],
        mintFee: mintFee[0],
        minTransfer: minTransfer[0],
    }];
}

export function useEthBridges() {
    const bridges = ASSETS.map(useEthBridge);
    if (bridges.some(bridge => !bridge)) return null; // still loading
    return Object.fromEntries(bridges);
}
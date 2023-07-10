import { blake2AsHex } from '@polkadot/util-crypto';
import { decodeAddress, encodeAddress } from '@polkadot/keyring';
import { hexToU8a, isHex } from '@polkadot/util';
import { ethers } from 'ethers';
import { compareAddress } from '@usedapp/core';
import BridgeABI from '../assets/abis/Bridge.json';

const polka_bn_u256be = (x) => {
    return x.toArray("be", 32);
};

const ethers_bn_u256be = (x) => {
    let bytes = hexStringToBytes(x.toHexString());
    let res = new Uint8Array(32); // effectively left-pad with zeros
    res.set(bytes, 32 - bytes.length);
    return res;
};

const hexStringToBytes = (x) => {
    let s = x;
    if (s.startsWith("0x")) s = s.substr(2);
    return Uint8Array.from(s.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)))
}

const u64be = (x) => {
    let buf = new ArrayBuffer(8);
    new DataView(buf).setBigUint64(0, BigInt(x), false);
    return new Uint8Array(buf, 0);
}

const u32be = (x) => {
    let buf = new ArrayBuffer(4);
    new DataView(buf).setUint32(0, x, false);
    return new Uint8Array(buf, 0);
};

export const subToEthReceiptId = (
    substrate_block_hash,
    event_idx,
    amount,
    recipient
) => {
    let hash = hexStringToBytes(substrate_block_hash);
    const data = new Uint8Array(
        [
            ...hash,
            ...u32be(event_idx),
            ...polka_bn_u256be(amount),
            ...recipient
        ]
    );
    return blake2AsHex(data, 256);
};

const _ethToSubReceiptId = (
    ethereum_block_hash,
    log_idx,
    amount,
    substrate_recipient,
) => {
    let hash = hexStringToBytes(ethereum_block_hash);
    let recipient = hexStringToBytes(substrate_recipient);

    const data = new Uint8Array(
        [
            ...hash,
            ...u64be(log_idx),
            ...ethers_bn_u256be(amount),
            ...recipient
        ]
    );
    return blake2AsHex(data, 256);
};

export const ethToSubReceiptIdFromEvent = (event) => {
    const block_hash = event.blockHash;
    const idx = event.logIndex;
    const amount = event.args.amount;
    const recipient = event.args.substrateRecipient;

    return _ethToSubReceiptId(block_hash, idx, amount, recipient);
}

export const ethToSubReceiptId = (ethers_receipt) => {
    const abi = new ethers.utils.Interface(BridgeABI.abi);
    const logs = ethers_receipt?.logs;
    if (!logs) return null;

    const event = logs
        .filter(l => compareAddress(l.address, ethers_receipt.to) == 0)
        .map(l => ({ event: abi.parseLog(l), log: l }))
        .find(e => e.event.name == "OutgoingReceipt");

    const block_hash = event.log.blockHash;
    const idx = event.log.logIndex;
    const amount = event.event.args.amount;
    const recipient = event.event.args.substrateRecipient;

    return _ethToSubReceiptId(block_hash, idx, amount, recipient);
}


// FIXME this is generic, we should move it to walletHelpers and use everywhere
export const isValidSubstrateAddress = (address) => {
    try {
        encodeAddress(
            isHex(address)
                ? hexToU8a(address)
                : decodeAddress(address)
        );

        return true;
    } catch (error) {
        return false;
    }
};
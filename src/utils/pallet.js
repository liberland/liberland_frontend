import { encodeAddress } from "@polkadot/util-crypto";
import { stringToU8a } from "@polkadot/util";

export const palletIdToAddress = (moduleId) => {
  const prefix = "modl";
  if (moduleId instanceof Uint8Array) {
    const pid = new TextDecoder().decode(moduleId);
    const addressSeed = (prefix + pid).padEnd(32, "\0");

    return encodeAddress(stringToU8a(addressSeed));
  } else if (typeof moduleId === "string") {
    const addressSeed = (prefix + moduleId).padEnd(32, "\0");
    return encodeAddress(stringToU8a(addressSeed));
  }
};

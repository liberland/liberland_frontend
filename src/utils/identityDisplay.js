/*
 * Reading a Substrate on-chain identity's display name for presentation.
 *
 * `info.display` is a `Data` enum, not a string. `toHuman()` returns one of:
 *   { Raw: 'Alice' }        — clean printable bytes
 *   { Raw: '0x416c696365' } — bytes polkadot.js declined to print, given back
 *                             as hex (any non-ASCII name lands here)
 *   { BlakeTwo256: '0x…' }  — the name is only committed as a hash
 *   'None'                  — no display name set
 *
 * Reading `.Raw` blindly therefore renders a hex blob as if it were the user's
 * name, which is what made the payment request look like it was showing an
 * address. Decode the hex back to text, and report a hashed identity as what
 * it is rather than printing the digest.
 */

const HEX = /^0x[0-9a-fA-F]*$/;

const hexToUtf8 = (hex) => {
  const pairs = hex.slice(2).match(/.{1,2}/g) || [];
  const bytes = Uint8Array.from(pairs.map((b) => parseInt(b, 16)));
  const text = new TextDecoder('utf-8', { fatal: false }).decode(bytes);
  // Drop replacement characters so undecodable bytes do not surface as garbage.
  return text.replace(/�/g, '').trim();
};

/**
 * @returns {{ name: string|null, isHashed: boolean }}
 *   name     — a human-readable display name, or null if there isn't one
 *   isHashed — the identity exists but commits only a hash, so no name is
 *              recoverable from chain state
 */
export const readIdentityDisplay = (identity) => {
  const info = identity?.isSome ? identity.unwrap()?.info : undefined;
  const human = info?.display?.toHuman?.();

  if (!human || human === 'None') return { name: null, isHashed: false };

  if (typeof human === 'string') {
    return { name: human.trim() || null, isHashed: false };
  }

  if (typeof human === 'object' && 'Raw' in human) {
    const raw = human.Raw;
    if (typeof raw !== 'string') return { name: null, isHashed: false };
    if (HEX.test(raw)) {
      const decoded = hexToUtf8(raw);
      return { name: decoded || null, isHashed: false };
    }
    return { name: raw.trim() || null, isHashed: false };
  }

  // BlakeTwo256 / Sha256 / Keccak256 / ShaThree256 — a commitment, not a name.
  return { name: null, isHashed: true };
};

export default readIdentityDisplay;

// FIXME refactor/deduplicate with offices after https://github.com/liberland/liberland_frontend/pull/69/files is merged

export function parseIdentityData(d) {
  if (!d) return undefined;
  if (d.isNone) return undefined;
  if (!d.isRaw) return undefined;
  return new TextDecoder("utf-8").decode(d.asRaw);
}

export function parseEligibleOn(eligible_on) {
  const bytes = new Uint8Array(eligible_on.asRaw); // little-endian
  bytes.reverse(); // big-endian
  const hex = Buffer.from(bytes).toString('hex');
  return parseInt(hex, 16);
}

export function parseCitizen(additional) {
  if (!additional) return false;

  let citizen = additional.find(([key, _]) => key.eq('citizen'));
  if(!citizen) return false;
  [, citizen] = citizen;
  if (!citizen.isRaw) return false;
  return citizen.eq("1");
}

export function parseCitizenshipJudgement(judgements) {
  if (!judgements) return false;
  
  return judgements.some((judgement) => {
    return (
        judgement[0].eq(0) &&
        judgement[1].isKnownGood
    );
  });
}

export function parseDOB(additional, currentBlockNumber) {
  if (!additional) return undefined;

  // FIXME refactor with offices
  let eligible_on = additional.find(([key, _]) => key.eq('eligible_on'));
  if(!eligible_on) return undefined;
  [, eligible_on] = eligible_on;
  if (!eligible_on.isRaw) return undefined;
  const now = new Date(); // FIXME we should get a time at which blockNumber was actually fetched
  const eligibleOnBlockNumber = parseEligibleOn(eligible_on);
  if (eligibleOnBlockNumber == 0) return false; // was eligible before blockchain started

  const msFromNow = (eligibleOnBlockNumber - currentBlockNumber) * 6 * 1000;
  const eligibleOnDate = new Date(now.getTime() + msFromNow);
  const birthDate = new Date(eligibleOnDate.getFullYear() - 13, eligibleOnDate.getMonth(), eligibleOnDate.getDate());
  return birthDate.toISOString().slice(0, 10);
}
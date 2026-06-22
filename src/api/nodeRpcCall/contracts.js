import { hexToU8a, u8aToHex } from '@polkadot/util';
import pako from 'pako';
import { getApi, submitExtrinsic } from './core';

const fetchCompanyRequests = async () => {
  const api = await getApi();
  const raw = await api.query.companyRegistry.requests.entries();
  return raw.map((rawEntry) => ({
    indexes: rawEntry[0].toHuman(),
  }));
};

const handleContractData = (data) => {
  let result = null;
  if (!data) return result;
  try {
    const hexData = data.toString('hex');
    result = Buffer.from(pako.inflate(hexToU8a(hexData))).toString('utf-8');
  } catch (err) {
    result = Buffer.from(data).toString('utf-8');
  }
  return result;
};

const getSignaturesForContracts = async (contractId) => {
  const api = await getApi();
  const judgesSignatures = await api.query.contractsRegistry.judgesSignatures.entries(contractId);
  const judgesSignaturesList = judgesSignatures.map(
    ([key, isSigned]) => ({ key: key.args[1].toString(), isSigned: isSigned.isTrue }),
  );
  const partiesSignatures = await api.query.contractsRegistry.partiesSignatures.entries(contractId);
  const partiesSignaturesList = partiesSignatures.map(
    ([key, isSigned]) => ({ key: key.args[1].toString(), isSigned: isSigned.isTrue }),
  );
  const judgesFiltered = judgesSignaturesList.filter((item) => item.isSigned === true);
  const partiesFiltered = partiesSignaturesList.filter((item) => item.isSigned === true);

  return { judgesSignaturesList: judgesFiltered, partiesSignaturesList: partiesFiltered };
};

const getSingleContract = async (contractId) => {
  const api = await getApi();
  const contract = await api.query.contractsRegistry.contracts(contractId);
  const contractUnwrap = contract.unwrapOr(null);
  const data = handleContractData(contractUnwrap?.data);
  const parties = (contract?.parties && contract?.parties.length > 0)
    ? contract?.parties.map((party) => party.toString())
    : [];

  const { judgesSignaturesList, partiesSignaturesList } = await getSignaturesForContracts(contractId);

  const keysArrayJudges = judgesSignaturesList.map((obj) => obj.key);
  const keysArrayParties = partiesSignaturesList.map((obj) => obj.key);

  return {
    contractId: contractId.toString(),
    data,
    parties,
    creator: contractUnwrap?.creator.toString(),
    deposit: contractUnwrap?.deposit.toString(),
    judgesSignaturesList: keysArrayJudges,
    partiesSignaturesList: keysArrayParties,
  };
};

const getAllContracts = async () => {
  const api = await getApi();
  const rawContracts = await api.query.contractsRegistry.contracts.entries();

  const contractPromises = rawContracts.map(async ([id, maybeContract]) => {
    const contractId = id.args[0];
    const contract = maybeContract.unwrapOr(null);
    const data = handleContractData(contract?.data);

    const { judgesSignaturesList, partiesSignaturesList } = await getSignaturesForContracts(contractId);
    const parties = (contract?.parties && contract?.parties.length > 0)
      ? contract?.parties.map((party) => party.toString())
      : [];
    const keysArrayJudges = judgesSignaturesList.map((obj) => obj.key);
    const keysArrayParties = partiesSignaturesList.map((obj) => obj.key);
    return {
      contractId: contractId.toString(),
      data,
      parties,
      creator: contract?.creator.toString(),
      deposit: contract?.deposit.toString(),
      judgesSignaturesList: keysArrayJudges,
      partiesSignaturesList: keysArrayParties,
    };
  });

  const contracts = await Promise.all(contractPromises);

  return contracts;
};

const signContractAsParty = async (contractId, walletAddress) => {
  const api = await getApi();
  const extrinsic = api.tx.contractsRegistry.partySignContract(contractId);
  return submitExtrinsic(extrinsic, walletAddress, api);
};

const signContractAsJudge = async (contractId, walletAddress) => {
  const api = await getApi();
  const extrinsic = api.tx.contractsRegistry.judgeSignContract(contractId);
  return submitExtrinsic(extrinsic, walletAddress, api);
};

const removeContract = async (contractId, walletAddress) => {
  const api = await getApi();
  const extrinsic = api.tx.contractsRegistry.removeContract(contractId);
  return submitExtrinsic(extrinsic, walletAddress, api);
};

const getAllJudges = async () => {
  const api = await getApi();
  const rawJudges = await api.query.contractsRegistry.judges.entries();
  return rawJudges.filter(([, isJudge]) => isJudge.isTrue).map(([address]) => address.args[0]);
};

const getIsUserJudges = async (walletAddress) => {
  const api = await getApi();
  const rawIsJudge = await api.query.contractsRegistry.judges(walletAddress);
  return rawIsJudge.isTrue;
};

const createContract = async (data, parties, walletAddress) => {
  const api = await getApi();

  const encodedData = new TextEncoder().encode(data);
  const compressed = pako.deflate(encodedData);

  const extrinsic = api.tx.contractsRegistry.createContract(u8aToHex(compressed), parties);
  return submitExtrinsic(extrinsic, walletAddress, api);
};

export {
  fetchCompanyRequests,
  getSignaturesForContracts,
  getSingleContract,
  getAllContracts,
  signContractAsParty,
  signContractAsJudge,
  removeContract,
  getAllJudges,
  getIsUserJudges,
  createContract,
};

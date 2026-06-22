/**
 * Tests for the proposal helpers in nodeRpcCall/proposals.js.
 *
 * These helpers were de-duplicated: the council ("congress") and senate
 * variants, plus the four "send" transfer variants, are now derived from
 * pallet/builder-parameterised factories instead of copy-pasted bodies. The
 * point of these tests is to prove that de-duplication did NOT change behaviour:
 * each public helper must still target the exact pallet and build the exact
 * extrinsic it did before.
 */

import { OfficeType } from '../../../utils/officeTypeEnum';

const mockGetApi = jest.fn();
const mockSubmitExtrinsic = jest.fn();

jest.mock('../core', () => ({
  getApi: (...args) => mockGetApi(...args),
  submitExtrinsic: (...args) => mockSubmitExtrinsic(...args),
}));

// Builds a fake polkadot-js api whose tx.<pallet>.<method>(...) calls are
// memoised jest.fns (so they can be asserted) returning objects that carry a
// `.method.hash`, which createProposalAndVote reads off the proposal.
function makeApi({ councilMembers = 5, senateMembers = 3 } = {}) {
  const calls = {};
  const txFn = (name) => {
    if (!calls[name]) {
      calls[name] = jest.fn((...args) => ({ __tx: name, args, method: { hash: `0x${name}` } }));
    }
    return calls[name];
  };

  const api = {
    tx: new Proxy({}, {
      get: (_t, pallet) => new Proxy({}, {
        get: (_p, method) => txFn(`${pallet}.${method}`),
      }),
    }),
    query: {
      council: {
        members: jest.fn(async () => new Array(councilMembers)),
        proposalCount: jest.fn(async () => 7),
      },
      senate: {
        members: jest.fn(async () => new Array(senateMembers)),
        proposalCount: jest.fn(async () => 9),
      },
    },
    __calls: calls,
  };
  return api;
}

describe('nodeRpcCall/proposals de-dup behaviour', () => {
  let api;
  let proposals;

  beforeEach(() => {
    jest.resetModules();
    mockGetApi.mockReset();
    mockSubmitExtrinsic.mockReset();
    api = makeApi();
    mockGetApi.mockResolvedValue(api);
    mockSubmitExtrinsic.mockResolvedValue('submitted');
    // eslint-disable-next-line global-require
    proposals = require('../proposals');
  });

  describe('majority thresholds target the correct pallet', () => {
    it('congressMajorityThreshold reads council.members and returns trunc(n/2)+1', async () => {
      const result = await proposals.congressMajorityThreshold();
      expect(api.query.council.members).toHaveBeenCalledTimes(1);
      expect(api.query.senate.members).not.toHaveBeenCalled();
      expect(result).toBe(3); // trunc(5/2)+1
    });

    it('senateMajorityThreshold reads senate.members and returns trunc(n/2)+1', async () => {
      const result = await proposals.senateMajorityThreshold();
      expect(api.query.senate.members).toHaveBeenCalledTimes(1);
      expect(api.query.council.members).not.toHaveBeenCalled();
      expect(result).toBe(2); // trunc(3/2)+1
    });
  });

  describe('createProposalAndVote targets the correct pallet', () => {
    const content = { method: { hash: '0xcontent' }, length: 4 };

    it('council variant proposes & votes on council', async () => {
      const [proposal, voteAye] = await proposals.createProposalAndVote(3, content, true);
      expect(api.__calls['council.propose']).toHaveBeenCalledWith(3, content, 4);
      expect(api.__calls['council.vote']).toHaveBeenCalledWith('0xcontent', 7, true);
      expect(proposal.__tx).toBe('council.propose');
      expect(voteAye.__tx).toBe('council.vote');
      expect(api.__calls['senate.propose']).toBeUndefined();
    });

    it('senate variant proposes & votes on senate', async () => {
      const [proposal, voteAye] = await proposals.createSenateProposalAndVote(2, content, true);
      expect(api.__calls['senate.propose']).toHaveBeenCalledWith(2, content, 4);
      expect(api.__calls['senate.vote']).toHaveBeenCalledWith('0xcontent', 9, true);
      expect(proposal.__tx).toBe('senate.propose');
      expect(voteAye.__tx).toBe('senate.vote');
      expect(api.__calls['council.propose']).toBeUndefined();
    });
  });

  describe('congressSenate send variants build the correct spend extrinsic', () => {
    const baseArgs = {
      walletAddress: '5Wallet',
      transferToAddress: '5Recipient',
      transferAmount: '1000',
      remarkInfo: 'memo',
      executionBlock: 42,
      officeType: OfficeType.CONGRESS,
    };

    it('Lld → balances.transfer(to, amount)', async () => {
      await proposals.congressSenateSendLld({ ...baseArgs });
      expect(api.__calls['balances.transfer']).toHaveBeenCalledWith('5Recipient', '1000');
      expect(mockSubmitExtrinsic).toHaveBeenCalled();
    });

    it('Llm → llm.sendLlm(to, amount)', async () => {
      await proposals.congressSenateSendLlm({ ...baseArgs });
      expect(api.__calls['llm.sendLlm']).toHaveBeenCalledWith('5Recipient', '1000');
    });

    it('LlmToPolitipool → llm.sendLlmToPolitipool(to, amount)', async () => {
      await proposals.congressSenateSendLlmToPolitipool({ ...baseArgs });
      expect(api.__calls['llm.sendLlmToPolitipool']).toHaveBeenCalledWith('5Recipient', '1000');
    });

    it('Assets → assets.transfer(parseInt(index), to, amount)', async () => {
      await proposals.congressSenateSendAssets({
        ...baseArgs,
        assetData: { index: '3' },
      });
      expect(api.__calls['assets.transfer']).toHaveBeenCalledWith(3, '5Recipient', '1000');
    });

    it('routes through the senate path when officeType is SENATE', async () => {
      await proposals.congressSenateSendLld({ ...baseArgs, officeType: OfficeType.SENATE });
      // senate spend goes through senateAccount.execute, not councilAccount
      expect(api.__calls['senateAccount.execute']).toHaveBeenCalled();
      expect(api.__calls['councilAccount.execute']).toBeUndefined();
    });

    it('routes through the congress path when officeType is CONGRESS', async () => {
      await proposals.congressSenateSendLld({ ...baseArgs, officeType: OfficeType.CONGRESS });
      expect(api.__calls['councilAccount.execute']).toHaveBeenCalled();
      expect(api.__calls['senateAccount.execute']).toBeUndefined();
    });
  });
});

import React from 'react';
import PropTypes from 'prop-types';
import { blake2AsHex } from '@polkadot/util-crypto';
import { hexToU8a } from '@polkadot/util';
import Collapse from 'antd/es/collapse';
import Flex from 'antd/es/flex';
import { useHistory } from 'react-router-dom';
import Button from '../../../../Button/Button';
import truncate from '../../../../../utils/truncate';
import Discussions from '../Discussions';
import Details from '../Details';
import CopyIconWithAddress from '../../../../CopyIconWithAddress';
import router from '../../../../../router';
import BlacklistButton from '../BlacklistButton';

const getHashAndLength = (boundedCall) => {
  if (boundedCall.lookup) {
    return [boundedCall.lookup.hash, boundedCall.lookup.len];
  }
  if (boundedCall.legacy) {
    return [boundedCall.legacy.hash, 0];
  }
  return [blake2AsHex(hexToU8a(boundedCall.inline)), 0];
};

function ProposalPage({
  centralizedDatas,
  boundedCall,
  blacklistMotion,
  userIsMember,
}) {
  const [hash, len] = getHashAndLength(boundedCall);
  const history = useHistory();

  return (
    <Collapse
      defaultActiveKey={['proposal']}
      collapsible="icon"
      items={[{
        key: 'proposal',
        label: (
          <Flex wrap gap="15px">
            Proposal
            <CopyIconWithAddress address={hash} />
          </Flex>
        ),
        extra: (
          <Flex wrap gap="15px">
            {blacklistMotion && (
              <Button link onClick={() => history.push(`${router.congress.motions}#${blacklistMotion}`)}>
                Blacklist motion:
                {' '}
                {truncate(blacklistMotion, 13)}
              </Button>
            )}
            {!blacklistMotion && userIsMember && (
              <BlacklistButton hash={boundedCall?.lookup?.hash ?? boundedCall?.legacy?.hash} />
            )}
          </Flex>
        ),
        children: (
          <>
            {hash && len && (
              <Details proposal={{ hash, len }} isProposal />
            )}
            {centralizedDatas?.length > 0 && <Discussions centralizedDatas={centralizedDatas} />}
          </>
        ),
      }]}
    />
  );
}

const call = PropTypes.oneOfType([
  PropTypes.shape({
    legacy: PropTypes.shape({
      hash: PropTypes.string.isRequired,
    }).isRequired,
  }),
  PropTypes.shape({
    lookup: PropTypes.shape({
      hash: PropTypes.string.isRequired,
      len: PropTypes.number.isRequired,
    }).isRequired,
  }),
  PropTypes.shape({
    // eslint-disable-next-line react/forbid-prop-types
    inline: PropTypes.any.isRequired,
  }),
]);

ProposalPage.propTypes = {
  centralizedDatas: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    proposerAddress: PropTypes.string.isRequired,
    created: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
  })).isRequired,
  boundedCall: call.isRequired,
  blacklistMotion: PropTypes.string.isRequired,
  userIsMember: PropTypes.string.isRequired,
};

export default ProposalPage;

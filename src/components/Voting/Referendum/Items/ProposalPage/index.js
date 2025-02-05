import React, { useEffect, useMemo } from 'react';
import Collapse from 'antd/es/collapse';
import Flex from 'antd/es/flex';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import Button from '../../../../Button/Button';
import truncate from '../../../../../utils/truncate';
import Discussions from '../Discussions';
import Details from '../Details';
import CopyIconWithAddress from '../../../../CopyIconWithAddress';
import router from '../../../../../router';
import BlacklistButton from '../BlacklistButton';
import { blockchainSelectors, democracySelectors } from '../../../../../redux/selectors';
import { democracyActions } from '../../../../../redux/actions';
import { getHashAndLength } from './utils';
import { useHideTitle } from '../../../../Layout/HideTitle';

function ProposalPage() {
  const history = useHistory();
  const { id } = useParams();
  const dispatch = useDispatch();
  const democracy = useSelector(democracySelectors.selectorDemocracyInfo);
  const userWalletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);
  useHideTitle();
  useEffect(() => {
    dispatch(democracyActions.getDemocracy.call(userWalletAddress));
  }, [dispatch, userWalletAddress]);

  const {
    centralizedDatas,
    boundedCall,
    blacklistMotion,
    userIsMember,
  } = useMemo(() => democracy?.democracy?.crossReferencedProposalsData?.find(({
    index,
  }) => index === parseInt(id)) || {}, [democracy, id]);

  const [hash, len] = useMemo(() => getHashAndLength(boundedCall), [boundedCall]);

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

export default ProposalPage;

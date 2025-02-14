import React, { useEffect, useMemo } from 'react';
import Collapse from 'antd/es/collapse';
import Flex from 'antd/es/flex';
import uniq from 'lodash/uniq';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import Title from 'antd/es/typography/Title';
import Space from 'antd/es/space';
import ArrowLeftOutlined from '@ant-design/icons/ArrowLeftOutlined';
import Button from '../../../../Button/Button';
import truncate from '../../../../../utils/truncate';
import Discussions from '../Discussions';
import Details from '../Details';
import CopyIconWithAddress from '../../../../CopyIconWithAddress';
import router from '../../../../../router';
import BlacklistButton from '../BlacklistButton';
import { blockchainSelectors, democracySelectors } from '../../../../../redux/selectors';
import { democracyActions, identityActions } from '../../../../../redux/actions';
import { getHashAndLength } from './utils';
import { useHideTitle } from '../../../../Layout/HideTitle';
import CopyInput from '../../../../CopyInput';
import styles from '../../../styles.module.scss';

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

  useEffect(() => {
    dispatch(identityActions.getIdentityMotions.call(
      uniq(centralizedDatas.map(({ proposerAddress }) => proposerAddress)),
    ));
  }, [dispatch, centralizedDatas]);

  const [hash, len] = useMemo(() => (boundedCall ? getHashAndLength(boundedCall) : []), [boundedCall]);

  const fullLink = `${window.location.protocol}//${window.location.host}${
    router.voting.proposalItem.replace(':id', id)}`;

  return (
    <Flex vertical gap="20px">
      <Flex className={styles.nav} wrap gap="15px" align="center">
        <Flex flex={1}>
          <Button onClick={() => history.goBack()}>
            <ArrowLeftOutlined />
            <Space />
            Back
          </Button>
        </Flex>
        <div>
          <CopyInput buttonLabel="Copy link to proposal" value={fullLink} />
        </div>
      </Flex>
      <Flex vertical gap="5px">
        <Title level={1}>
          Proposal
          {' #'}
          {id}
        </Title>
        <div className="description">
          <CopyIconWithAddress address={hash} />
        </div>
      </Flex>
      {hash && len && <Details proposal={{ hash, len }} isProposal />}
      <Collapse
        defaultActiveKey={['voting', 'discussion']}
        collapsible="icon"
        items={[
          (blacklistMotion || userIsMember) && {
            key: 'voting',
            label: 'Voting',
            children: (
              <Flex wrap gap="15px">
                {blacklistMotion && (
                  <Button onClick={() => history.push(`${router.congress.motions}#${blacklistMotion}`)}>
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
          },
          centralizedDatas?.length > 0 && {
            key: 'discussion',
            label: 'Discussion',
            children: (
              <Discussions centralizedDatas={centralizedDatas} />
            ),
          },
        ].filter(Boolean)}
      />
    </Flex>
  );
}

export default ProposalPage;

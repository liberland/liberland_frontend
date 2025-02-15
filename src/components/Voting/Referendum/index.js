import React, {
  useContext,
  useEffect,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Result from 'antd/es/result';
import Collapse from 'antd/es/collapse';
import Flex from 'antd/es/flex';
import List from 'antd/es/list';
import { useHistory } from 'react-router-dom';
import { AuthContext } from 'react-oauth2-code-pkce';
import {
  blockchainSelectors,
  democracySelectors,
  userSelectors,
} from '../../../redux/selectors';
import ProposalItem from './Items/ProposalItem';
import DispatchItem from './Items/DispatchItem';
import { UndelegateModal } from '../../Modals';
import { democracyActions } from '../../../redux/actions';
import Button from '../../Button/Button';
import router from '../../../router';
import ReferendumItem from './Items/ReferendumItem';

function Referendum() {
  const history = useHistory();
  const dispatch = useDispatch();
  const democracy = useSelector(democracySelectors.selectorDemocracyInfo);
  const userWalletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);
  const { login } = useContext(AuthContext);
  const user = useSelector(userSelectors.selectUser);

  useEffect(() => {
    dispatch(democracyActions.getDemocracy.call(userWalletAddress));
  }, [dispatch, userWalletAddress]);

  const handleSubmitUndelegate = () => {
    dispatch(democracyActions.undelegate.call({ userWalletAddress }));
  };
  const delegatingTo = democracy.democracy?.userVotes?.Delegating?.target;

  return (
    <Collapse
      defaultActiveKey={['referendums', 'proposals', 'dispatches']}
      collapsible="icon"
      items={[
        {
          key: 'referendums',
          label: 'Referendums',
          extra: (
            <Flex wrap gap="15px">
              {delegatingTo && (
                <Flex vertical gap="20px">
                  <div className="description">
                    Delegating to:
                    {' '}
                    {delegatingTo}
                  </div>
                  <UndelegateModal
                    delegatee={delegatingTo}
                    onSubmitUndelegate={handleSubmitUndelegate}
                  />
                </Flex>
              )}
              {user ? (
                <Button primary onClick={() => history.push(router.voting.addLegislation)}>
                  Propose
                </Button>
              ) : (
                <Button
                  onClick={() => login()}
                  primary
                >
                  Log in to propose referenda
                </Button>
              )}
            </Flex>
          ),
          children: democracy.democracy?.crossReferencedReferendumsData?.length ? (
            <List
              dataSource={democracy.democracy.crossReferencedReferendumsData}
              renderItem={(referendum) => (
                <List.Item>
                  <ReferendumItem
                    voted={{
                      yayVotes: referendum.votedAye,
                      nayVotes: referendum.votedNay,
                      votedTotal: referendum.votedTotal,
                    }}
                    hash={referendum.imageHash}
                    proposal={referendum.image.proposal}
                  />
                </List.Item>
              )}
            />
          ) : <Result status={404} title="There are no active Referendums" />,
        },
        {
          key: 'proposals',
          label: 'Proposals',
          children: democracy.democracy?.crossReferencedProposalsData?.length ? (
            <List
              dataSource={democracy.democracy.crossReferencedProposalsData}
              renderItem={(proposal) => (
                <List.Item>
                  <ProposalItem
                    boundedCall={proposal.boundedCall}
                    id={proposal.index}
                  />
                </List.Item>
              )}
            />
          ) : <Result status={404} title="There are no active Proposals" />,
        },
        {
          key: 'dispatches',
          label: 'Dispatches',
          children: democracy.democracy?.scheduledCalls?.length ? (
            <List
              dataSource={democracy.democracy.scheduledCalls}
              renderItem={(item) => (
                <List.Item>
                  <DispatchItem
                    item={item}
                  />
                </List.Item>
              )}
            />
          ) : <Result status={404} title="There are no active Dispatches" />,
        },
      ]}
    />
  );
}

export default Referendum;

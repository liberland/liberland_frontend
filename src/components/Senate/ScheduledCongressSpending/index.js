import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Result from 'antd/es/result';
import List from 'antd/es/list';
import Card from 'antd/es/card';
import { identityActions, senateActions } from '../../../redux/actions';
import { senateSelectors } from '../../../redux/selectors';
import { Proposal } from '../../Proposal';
import Button from '../../Button/Button';
import ProposalContainer from '../../Proposal/ProposalContainer';
import { useMotionContext } from '../../WalletCongresSenate/ContextMotions';

function ScheduledCongressSpending({ isVetoButton }) {
  const dispatch = useDispatch();
  const scheduledCalls = useSelector(senateSelectors.scheduledCalls);
  const userIsMember = useSelector(senateSelectors.userIsMember);

  useEffect(() => {
    dispatch(senateActions.senateGetCongressSpending.call());
  }, [dispatch]);

  const { motionIds } = useMotionContext();

  useEffect(() => {
    const votes = scheduledCalls.map((item) => item.votes);
    dispatch(identityActions.getIdentityMotions.call(Array.from(new Set(motionIds.concat(votes.flat())))));
  }, [motionIds, dispatch, scheduledCalls]);

  if (!scheduledCalls || scheduledCalls.length < 1) {
    return <Result status={404} title="There are no open items" />;
  }

  return (
    <List
      dataSource={scheduledCalls.filter(({ sectionType }) => sectionType === 'congress')}
      renderItem={({
        preimage, proposal, blockNumber, idx,
      }) => {
        const proposalData = preimage || proposal;
        const onVetoClick = () => {
          dispatch(senateActions.senateProposeCloseMotion.call(
            { executionBlock: blockNumber, idx },
          ));
        };
        return (
          <List.Item>
            <Card
              actions={
                isVetoButton && userIsMember ? [
                  <Button onClick={onVetoClick} primary>Veto</Button>,
                ] : []
              }
              title={`Scheduled item: ${idx}`}
            >
              <ProposalContainer>
                <Proposal
                  proposal={proposalData}
                  isTableRow
                />
              </ProposalContainer>
            </Card>
          </List.Item>
        );
      }}
    />
  );
}

ScheduledCongressSpending.defaultProps = {
  isVetoButton: false,
};

ScheduledCongressSpending.propTypes = {
  isVetoButton: PropTypes.bool,
};

export default ScheduledCongressSpending;

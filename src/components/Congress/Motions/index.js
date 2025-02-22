import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import List from 'antd/es/list';
import Result from 'antd/es/result';
import { congressActions, identityActions } from '../../../redux/actions';
import { congressSelectors } from '../../../redux/selectors';
import Motion from '../../WalletCongresSenate/Motion';
import { useMotionContext } from '../../WalletCongresSenate/ContextMotions';
import ProposalContainer from '../../Proposal/ProposalContainer';

function Motions() {
  const dispatch = useDispatch();
  const motions = useSelector(congressSelectors.motions);
  const userIsMember = useSelector(congressSelectors.userIsMember);
  const { motionIds } = useMotionContext();

  useEffect(() => {
    dispatch(congressActions.getMotions.call());
  }, [dispatch]);

  useEffect(() => {
    dispatch(congressActions.getMembers.call());
  }, [dispatch]);

  useEffect(() => {
    const votes = motions.map((item) => item.votes);
    dispatch(identityActions.getIdentityMotions.call(Array.from(new Set(motionIds.concat(votes.flat())))));
  }, [motions, motionIds, dispatch]);

  if (!motions || motions.length < 1) {
    return <Result status={404} title="There are no open motions" />;
  }

  return (
    <List
      dataSource={motions}
      renderItem={({
        proposal, proposalOf, voting, membersCount,
      }) => (
        <List.Item>
          <ProposalContainer noTable>
            <Motion
              userIsMember={userIsMember}
              membersCount={membersCount}
              key={proposal}
              proposal={proposal.toString()}
              proposalOf={proposalOf.unwrap()}
              voting={voting.unwrap()}
              voteMotion={(data) => congressActions.voteAtMotions.call(data)}
              closeMotion={(data) => congressActions.closeMotion.call(data)}
              isTableRow
            />
          </ProposalContainer>
        </List.Item>
      )}
    />
  );
}

export default Motions;

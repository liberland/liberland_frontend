import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import List from 'antd/es/list';
import Divider from 'antd/es/divider';
import Alert from 'antd/es/alert';
import { identityActions, senateActions } from '../../../redux/actions';
import { senateSelectors } from '../../../redux/selectors';
import Motion from '../../WalletCongresSenate/Motion';
import { useMotionContext } from '../../WalletCongresSenate/ContextMotions';
import ProposalContainer from '../../Proposal/ProposalContainer';

function Motions() {
  const dispatch = useDispatch();
  const motions = useSelector(senateSelectors.motions);
  const userIsMember = useSelector(senateSelectors.userIsMember);
  const { motionIds } = useMotionContext();

  useEffect(() => {
    dispatch(senateActions.senateGetMotions.call());
  }, [dispatch]);

  useEffect(() => {
    const votes = motions.map((item) => item.votes);
    dispatch(identityActions.getIdentityMotions.call(Array.from(new Set(motionIds.concat(votes.flat())))));
  }, [motions, motionIds, dispatch]);

  if (!motions?.length) {
    return <Alert type="info" message="There are no open motions" />;
  }

  return (
    <List
      dataSource={motions}
      renderItem={({
        proposal,
        proposalOf,
        voting,
        membersCount,
      }) => (
        <ProposalContainer noTable>
          <Motion
            userIsMember={userIsMember}
            membersCount={membersCount}
            proposal={proposal.toString()}
            proposalOf={proposalOf}
            voting={voting.unwrap()}
            voteMotion={(data) => senateActions.senateVoteAtMotions.call(data)}
            closeMotion={(data) => senateActions.senateCloseMotion.call(data)}
            isTableRow
          />
          <Divider />
        </ProposalContainer>
      )}
    />
  );
}

export default Motions;

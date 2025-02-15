import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import List from 'antd/es/list';
import Result from 'antd/es/result';
import { congressActions, identityActions, senateActions } from '../../../redux/actions';
import { congressSelectors, senateSelectors } from '../../../redux/selectors';
import Motion from '../../WalletCongresSenate/Motion';
import { useMotionContext } from '../../WalletCongresSenate/ContextMotions';
import ProposalContainer from '../../Proposal/ProposalContainer';

function Motions({
  isSenate,
}) {
  const dispatch = useDispatch();
  const motions = useSelector(congressSelectors.motions);
  const userIsMember = useSelector(isSenate ? congressSelectors.userIsMember : senateSelectors.userIsMember);
  const { motionIds } = useMotionContext();

  useEffect(() => {
    dispatch(congressActions.getMotions.call());
  }, [dispatch]);

  useEffect(() => {
    if (isSenate) {
      dispatch(congressActions.getMembers.call());
    } else {
      dispatch(senateActions.senateGetMembers.call());
    }
  }, [dispatch, isSenate]);

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

Motions.propTypes = {
  isSenate: PropTypes.bool,
};

export default Motions;

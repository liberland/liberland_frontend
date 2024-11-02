import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './styles.module.scss';

// REDUX
import { congressActions, identityActions } from '../../../redux/actions';
import { congressSelectors } from '../../../redux/selectors';
import Motion from '../../WalletCongresSenate/Motion';
import { useMotionContext } from '../../WalletCongresSenate/ContextMotions';
import ProposalTable from '../../Proposal/ProposalTable';
import { Proposal } from '../../Proposal';
import stylesPage from '../../../utils/pagesBase.module.scss';
import Card from '../../Card';
import {
  groupProposals,
  unBatchProposals,
  proposalHeading,
  isTableReady,
} from '../../Proposal/utils';

export default function Motions() {
  const dispatch = useDispatch();
  const motions = useSelector(congressSelectors.motions);
  const { motionIds } = useMotionContext();

  React.useEffect(() => {
    dispatch(congressActions.getMotions.call());
  }, [dispatch]);

  React.useLayoutEffect(() => {
    if (motionIds.length > 0) {
      dispatch(identityActions.getIdentityMotions.call(Array.from(new Set(motionIds))));
    }
  }, [motions, motionIds, dispatch]);

  const groupedMotions = React.useMemo(() => {
    const unbatched = unBatchProposals(
      motions || [],
      (prop) => prop.proposalOf.toHuman(),
    );
    return groupProposals(unbatched, (prop) => prop.proposalOf.toHuman());
  }, [motions]);

  if (!motions?.length) {
    return (<div>There are no open motions</div>);
  }

  return (
    <div className={styles.wrapper}>
      {Object.values(groupedMotions).map((motionGroups) => Object.values(motionGroups).map((mots) => (
        <Card
          key={mots[0].proposal}
          title={proposalHeading({ proposal: mots[0].proposalOf })}
          className={stylesPage.overviewWrapper}
        >
          {isTableReady({ proposal: mots[0].proposalOf }) ? (
            <ProposalTable
              proposals={mots.map(({ proposalOf }) => ({ proposal: proposalOf.unwrap() }))}
              controls={mots.map(({
                membersCount,
                proposal,
                voting,
              }) => (
                <Motion
                  membersCount={membersCount}
                  key={proposal}
                  proposal={proposal.toString()}
                  voting={voting.unwrap()}
                  voteMotion={(data) => congressActions.voteAtMotions.call(data)}
                  closeMotion={(data) => congressActions.closeMotion.call(data)}
                />
              ))}
            />
          ) : mots.map(({
            proposalOf,
            proposal,
            membersCount,
            voting,
          }) => (
            <div key={proposal}>
              <Motion
                membersCount={membersCount}
                proposal={proposal.toString()}
                voting={voting.unwrap()}
                voteMotion={(data) => congressActions.voteAtMotions.call(data)}
                closeMotion={(data) => congressActions.closeMotion.call(data)}
              />
              <Proposal proposal={proposalOf.unwrap()} />
            </div>
          ))}
        </Card>
      )))}
    </div>
  );
}

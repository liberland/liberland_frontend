import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Card from '../../Card';
import styles from './styles.module.scss';
import Button from '../../Button/Button';

// REDUX
import { congressActions } from '../../../redux/actions';
import {
  congressSelectors,
  blockchainSelectors,
} from '../../../redux/selectors';

export default function Motions() {
  const dispatch = useDispatch();
  const motions = useSelector(congressSelectors.congressMotions);

  useEffect(() => {
    dispatch(congressActions.getMotions.call());
  }, [dispatch]);

  return (
    <div>
      {motions.map(({ proposal, proposalOf, voting }) => {
        const readableProposal = proposal.toHuman();
        const readableProposalOf = proposalOf.toHuman();
        const readableVoting = voting.toHuman();

        return (
          <Motion
            key={readableProposal}
            proposal={readableProposal}
            proposalOf={readableProposalOf}
            voting={readableVoting}
          />
        );
      })}
    </div>
  );
}

function Motion({ proposal, proposalOf, voting }) {
  const dispatch = useDispatch();
  const sender = useSelector(blockchainSelectors.userWalletAddressSelector);

  return (
    <Card
      key={proposal}
      title={`${proposalOf.method}`}
      className={styles.cardProposalsSection}
    >
      <div>
        <div className={styles.metaInfoLine}>
          <p>
            Proposal id:
            {proposal}
          </p>
          <p>
            Aye
            <b>
              {voting.ayes.length}
              /
              {voting.threshold}
            </b>
          </p>
        </div>
        <p>
          Threshold:
          {voting.threshold}
        </p>

        <pre>{JSON.stringify(proposalOf.args, null, 2)}</pre>
        <div className={styles.buttonsContainer}>
          {!voting.ayes.includes(sender) && (
            <Button
              medium
              primary
              onClick={() => dispatch(
                congressActions.voteAtMotions.call({
                  readableProposal: proposal,
                  index: voting.index,
                  vote: true,
                }),
              )}
            >
              Vote aye
            </Button>
          )}
          {!voting.nays.includes(sender) && (
            <Button
              medium
              secondary
              onClick={() => dispatch(
                congressActions.voteAtMotions.call({
                  readableProposal: proposal,
                  index: voting.index,
                  vote: false,
                }),
              )}
            >
              Vote nay
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

Motion.propTypes = {
  proposal: PropTypes.string.isRequired,
  proposalOf: PropTypes.shape({
    // eslint-disable-next-line react/forbid-prop-types
    args: PropTypes.object.isRequired,
    method: PropTypes.string.isRequired,
    section: PropTypes.string.isRequired,
  }).isRequired,
  voting: PropTypes.shape({
    index: PropTypes.string.isRequired,
    threshold: PropTypes.string.isRequired,
    ayes: PropTypes.arrayOf(PropTypes.string).isRequired,
    nays: PropTypes.arrayOf(PropTypes.string).isRequired,
    end: PropTypes.string.isRequired,
  }).isRequired,
};

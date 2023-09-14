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
  const motions = useSelector(congressSelectors.motions);

  useEffect(() => {
    dispatch(congressActions.getMotions.call());
  }, [dispatch]);

  return (
    <div>
      {motions.map(({ proposal, proposalOf, voting }) => (
        <Motion
          key={proposal}
          proposal={proposal.toString()}
          proposalOf={proposalOf.unwrap()}
          voting={voting.unwrap()}
        />
      ))}
    </div>
  );
}

function Motion({ proposal, proposalOf, voting }) {
  const dispatch = useDispatch();
  const userAddress = useSelector(blockchainSelectors.userWalletAddressSelector);

  const threshold = voting.threshold.toNumber();

  const isClosable = voting.ayes.length >= threshold;

  return (
    <Card
      title={`${proposalOf.section}.${proposalOf.method}`}
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
            {' '}
            <b>
              {voting.ayes.length}
              /
              {threshold}
            </b>
          </p>
        </div>

        <pre>{JSON.stringify(proposalOf.args, null, 2)}</pre>
        <div className={styles.buttonsContainer}>
          { isClosable && (
            <Button
              medium
              primary
              onClick={() => dispatch(
                congressActions.closeMotion.call({
                  proposal, index: voting.index,
                }),
              )}
            >
              Close & Execute
            </Button>
          )}
          {!voting.ayes.map((v) => v.toString()).includes(userAddress) && !isClosable && (
            <Button
              medium
              primary
              onClick={() => dispatch(
                congressActions.voteAtMotions.call({
                  proposal,
                  index: voting.index,
                  vote: true,
                }),
              )}
            >
              Vote aye
            </Button>
          )}
          {!voting.nays.map((v) => v.toString()).includes(userAddress) && !isClosable && (
            <Button
              medium
              secondary
              onClick={() => dispatch(
                congressActions.voteAtMotions.call({
                  proposal,
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

/* eslint-disable react/forbid-prop-types */
Motion.propTypes = {
  proposal: PropTypes.string.isRequired,
  proposalOf: PropTypes.shape({
    args: PropTypes.array.isRequired,
    method: PropTypes.string.isRequired,
    section: PropTypes.string.isRequired,
  }).isRequired,
  voting: PropTypes.shape({
    index: PropTypes.object.isRequired,
    threshold: PropTypes.object.isRequired,
    ayes: PropTypes.arrayOf(PropTypes.object).isRequired,
    nays: PropTypes.arrayOf(PropTypes.object).isRequired,
    end: PropTypes.object.isRequired,
  }).isRequired,
};

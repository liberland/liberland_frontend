import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Card from '../../Card';
import styles from './styles.module.scss';
import Button from '../../Button/Button';
import truncate from '../../../utils/truncate';

// REDUX
import { congressActions } from '../../../redux/actions';
import {
  congressSelectors,
  blockchainSelectors,
} from '../../../redux/selectors';
import { Proposal } from '../../Proposal';

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
  const userAddress = useSelector(
    blockchainSelectors.userWalletAddressSelector,
  );

  const threshold = voting.threshold.toNumber();

  const isClosable = voting.ayes.length >= threshold;

  return (
    <Card
      className={styles.cardProposalsSection}
    >

      <div>
        <div className={styles.metaInfoLine}>

          <p>
            Proposal id:
            <b>{truncate(proposal, 13)}</b>
          </p>
          <span>
            <p>
              Aye
              {' '}
              <b>
                {voting.ayes.length}
                /
                {threshold}
              </b>
            </p>
            <p>
              Nay
              {' '}
              <b>
                {voting.nays.length}
                /
                {threshold}
              </b>
            </p>
          </span>
        </div>

        <div className={styles.buttonsContainer}>
          {isClosable && (
            <Button
              medium
              primary
              onClick={() => dispatch(
                congressActions.closeMotion.call({
                  proposal,
                  index: voting.index,
                }),
              )}
            >
              Close & Execute
            </Button>
          )}
          {!voting.ayes.map((v) => v.toString()).includes(userAddress)
            && !isClosable && (
              <Button
                small
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
          {!voting.nays.map((v) => v.toString()).includes(userAddress)
            && !isClosable && (
              <Button
                small
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
        <Proposal proposal={proposalOf} />
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
    toHuman: PropTypes.func.isRequired,
  }).isRequired,
  voting: PropTypes.shape({
    index: PropTypes.object.isRequired,
    threshold: PropTypes.object.isRequired,
    ayes: PropTypes.arrayOf(PropTypes.object).isRequired,
    nays: PropTypes.arrayOf(PropTypes.object).isRequired,
    end: PropTypes.object.isRequired,
  }).isRequired,
};

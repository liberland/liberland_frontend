import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Card from '../../Card';
import styles from './styles.module.scss';
import Button from '../../Button/Button';
import truncate from '../../../utils/truncate';
import stylesPage from '../../../utils/pagesBase.module.scss';

// REDUX
import {
  blockchainSelectors,
  identitySelectors,
} from '../../../redux/selectors';
import { Proposal } from '../../Proposal';
import { walletAddress } from '../../../redux/selectors/congress';
import CopyIconWithAddress from '../../CopyIconWithAddress';

function Voters({ voting }) {
  const names = useSelector(identitySelectors.selectorIdentityMotions);
  return (
    <ul className={styles.list}>
      {voting.map((item) => {
        const id = item.toString();
        const identity = names?.[id]?.identity;
        return (
          <li key={id}>
            <CopyIconWithAddress
              isTruncate
              name={identity?.name}
              legal={identity?.legal}
              address={id}
              showAddress
            />
          </li>
        );
      })}
    </ul>
  );
}

Voters.propTypes = {
  voting: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default function Motion({
  proposal, proposalOf, voting, voteMotion, closeMotion, membersCount,
}) {
  const dispatch = useDispatch();
  const userAddress = useSelector(
    blockchainSelectors.userWalletAddressSelector,
  );

  const threshold = voting.threshold.toNumber();

  const isClosable = voting.ayes.length >= threshold;

  const isClosableNaye = voting.nays.length > membersCount - threshold;

  const voteMotionCall = (vote) => {
    const voteMotionData = {
      proposal,
      index: voting.index,
      vote,
    };
    dispatch(voteMotion(voteMotionData));
  };
  return (
    <div className={stylesPage.stakingWrapper}>
      <Card className={stylesPage.overviewWrapper}>
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
            <Voters voting={voting.ayes} />
            <p>
              Nay
              {' '}
              <b>
                {voting.nays.length}
                /
                {threshold}
              </b>
            </p>
            <Voters voting={voting.nays} />
          </span>
        </div>

        <div className={styles.buttonsContainer}>
          {isClosable && (
          <Button
            medium
            primary
            onClick={() => dispatch(
              closeMotion({ proposal, index: voting.index }),
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
                onClick={() => voteMotionCall(true)}
              >
                Vote aye
              </Button>
          )}
          {!voting.nays.map((v) => v.toString()).includes(userAddress)
            && !isClosable && (
              <Button
                small
                secondary
                onClick={() => voteMotionCall(false)}
              >
                Vote nay
              </Button>
          )}
          {
            isClosableNaye && (
            <Button
              small
              secondary
              onClick={() => dispatch(
                closeMotion({ proposal, index: voting.index, walletAddress }),
              )}
            >
              Close Motion
            </Button>
            )
          }
        </div>
        <Proposal proposal={proposalOf} />
      </Card>
    </div>
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
  closeMotion: PropTypes.func.isRequired,
  voteMotion: PropTypes.func.isRequired,
  membersCount: PropTypes.number.isRequired,
};

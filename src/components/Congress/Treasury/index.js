import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { BN_ZERO } from '@polkadot/util';
import styles from './styles.module.scss';
import { formatDollars } from '../../../utils/walletHelpers';
import Button from '../../Button/Button';

// REDUX
import { congressActions } from '../../../redux/actions';
import {
  congressSelectors,
  blockchainSelectors,
} from '../../../redux/selectors';
import router from '../../../router';

function Proposal({
  id, council, proposal: { beneficiary, value }, approved, userIsMember,
}) {
  const dispatch = useDispatch();

  const approve = () => {
    dispatch(congressActions.approveTreasurySpend.call({ id }));
  };

  const unapprove = () => {
    dispatch(congressActions.unapproveTreasurySpend.call({ id }));
  };

  return (
    <div className={styles.proposalWrapper}>
      <div className={styles.listItemName}>{id.toString()}</div>
      <div className={styles.listItem}>
        {beneficiary.toString()}
      </div>
      <div className={styles.listItem}>
        {formatDollars(value)}
        {' '}
        LLD
      </div>
      <div className={styles.listItem}>
        {approved ? 'YES' : 'NO'}
        {council.length > 0 && <Link to={router.congress.motions}>See change motion</Link>}
      </div>
      {userIsMember && (
        <div className={styles.listItem}>
          {approved
            ? (
              <Button primary small onClick={unapprove}>
                Unapprove
              </Button>
            )
            : (
              <Button primary small onClick={approve}>
                Approve
              </Button>
            )}
        </div>
      )}
    </div>
  );
}

Proposal.defaultProps = {
  approved: false,
};

Proposal.propTypes = {
  id: PropTypes.shape({
    toString: PropTypes.func.isRequired,
  }).isRequired,
  proposal: PropTypes.shape({
    // eslint-disable-next-line react/forbid-prop-types
    beneficiary: PropTypes.object.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    value: PropTypes.object.isRequired,
  }).isRequired,
  userIsMember: PropTypes.bool.isRequired,
  approved: PropTypes.bool,
  // eslint-disable-next-line react/forbid-prop-types
  council: PropTypes.array.isRequired,
};

export default function Treasury() {
  const dispatch = useDispatch();
  const treasuryInfo = useSelector(congressSelectors.treasury);

  const members = useSelector(congressSelectors.members);
  const user = useSelector(blockchainSelectors.userWalletAddressSelector);
  const currentBlockNumber = useSelector(blockchainSelectors.blockNumber);

  const userIsMember = members.map((m) => m.toString()).includes(user);

  useEffect(() => {
    dispatch(congressActions.getMembers.call());
    dispatch(congressActions.getTreasuryInfo.call());
  }, [dispatch]);

  if (!treasuryInfo.proposals.approvals) return null;

  const period = treasuryInfo.period.toNumber();
  const periodRemaining = period - (currentBlockNumber % period);

  const periodDays = parseInt((period * 6) / 3600 / 24);
  const periodRemainingDays = parseInt((periodRemaining * 6) / 3600 / 24);

  const totalApproved = treasuryInfo.proposals.approvals.reduce(
    (total, { proposal: { value } }) => total.add(value),
    BN_ZERO,
  );
  const remainingBudget = treasuryInfo.budget.sub(totalApproved);

  return (
    <div>
      <div>
        Spend period:
        {periodDays}
        {' '}
        days
      </div>
      <div>
        Current period ends in
        {periodRemainingDays}
        {' '}
        days
      </div>
      <div>
        Total budget:
        {formatDollars(treasuryInfo.budget)}
        {' '}
        LLD
      </div>
      <div>
        Remaining budget:
        {formatDollars(remainingBudget)}
        {' '}
        LLD
      </div>
      <div className={styles.proposalListHeader}>
        <div className={styles.listItemName}>
          ID
        </div>
        <div className={styles.listItem}>
          Beneficiary
        </div>
        <div className={styles.listItem}>
          Value
        </div>
        <div className={styles.listItem}>
          Approved
        </div>
        {userIsMember && (
          <div className={styles.listItem}>
            Actions
          </div>
        )}
      </div>
      {treasuryInfo.proposals.approvals.map(({ id, proposal, council }) => (
        <Proposal
          key={id.toString()}
          id={id}
          council={council}
          proposal={proposal}
          userIsMember={userIsMember}
          approved
        />
      ))}
      {treasuryInfo.proposals.proposals.map(({ id, proposal, council }) => (
        <Proposal
          key={id.toString()}
          id={id}
          council={council}
          proposal={proposal}
          userIsMember={userIsMember}
        />
      ))}
    </div>
  );
}

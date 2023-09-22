import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { BN_ZERO } from '@polkadot/util';
import styles from './styles.module.scss';
import congressStyles from '../styles.module.scss';
import { formatDollars } from '../../../utils/walletHelpers';
import Button from '../../Button/Button';
import TreasurySpendingMotionModalWrapper from '../../Modals/TreasurySpendingMotionModal';

// REDUX
import { congressActions } from '../../../redux/actions';
import {
  congressSelectors,
  blockchainSelectors,
} from '../../../redux/selectors';
import router from '../../../router';

function Proposal({
  id,
  council,
  proposal: { beneficiary, value },
  approved,
  userIsMember,
}) {
  const dispatch = useDispatch();

  const approve = () => {
    dispatch(congressActions.approveTreasurySpend.call({ id }));
  };

  const unapprove = () => {
    dispatch(congressActions.unapproveTreasurySpend.call({ id }));
  };

  return (
    <tr className={styles.proposalWrapper}>
      <td className={styles.listItem}>{id.toString()}</td>
      <td className={styles.listItem}>
        <small>{beneficiary.toString()}</small>
      </td>
      <td className={styles.listItem}>
        {formatDollars(value)}
        {' '}
        LLD
      </td>
      <td className={styles.listItem}>
        <b>{approved ? 'YES' : 'NO'}</b>
        {council.length > 0 && (
          <Link to={router.congress.motions}>See change motion</Link>
        )}
      </td>
      {userIsMember && (
        <td className={styles.listItem}>
          <div className={congressStyles.rowEnd}>
            {approved ? (
              <Button primary small onClick={unapprove}>
                Unapprove
              </Button>
            ) : (
              <Button primary small onClick={approve}>
                Approve
              </Button>
            )}
          </div>
        </td>
      )}
    </tr>
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

  const [isSpendingModalOpen, setIsSpendingModalOpen] = useState(false);
  const handleSpendingModalOpen = () => setIsSpendingModalOpen(!isSpendingModalOpen);

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
    <div className={congressStyles.congressWrapper}>
      <div className={congressStyles.rowWrapper}>
        <div className={congressStyles.navCol}>
          <h4>Spend period</h4>
          <p>
            {periodDays}
            {' '}
            days
          </p>
        </div>
        <div className={congressStyles.navCol}>
          <h4>Current period ends in</h4>
          <p>
            {periodRemainingDays}
            {' '}
            days
          </p>
        </div>
        <div className={congressStyles.navCol}>
          <h4>Total budget</h4>
          <p>
            {formatDollars(treasuryInfo.budget)}
            {' '}
            LLD
          </p>
        </div>
        <div className={congressStyles.navCol}>
          <h4>Remaining budget</h4>
          <p>
            {formatDollars(remainingBudget)}
            {' '}
            LLD
          </p>
        </div>
        <div className={congressStyles.rowEnd}>
          <Button primary medium onClick={handleSpendingModalOpen}>
            Propose spend
          </Button>
        </div>
      </div>
      <div>
        {isSpendingModalOpen && (
          <TreasurySpendingMotionModalWrapper
            closeModal={handleSpendingModalOpen}
          />
        )}

        <table>
          <thead>
            {(treasuryInfo.proposals.approvals.length > 0
              || treasuryInfo.proposals.proposals.length > 0) && (
              <tr className={styles.proposalListHeader}>
                <th className={styles.listItem}>ID</th>
                <th className={styles.listItem}>Beneficiary</th>
                <th className={styles.listItem}>Value</th>
                <th className={styles.listItem}>Approved</th>
                {userIsMember && <th className={styles.listItem}>Actions</th>}
              </tr>
            )}
          </thead>
          <tbody>
            {treasuryInfo.proposals.approvals.map(
              ({ id, proposal, council }) => (
                <Proposal
                  key={id.toString()}
                  id={id}
                  council={council}
                  proposal={proposal}
                  userIsMember={userIsMember}
                  approved
                />
              ),
            )}
            {treasuryInfo.proposals.proposals.map(
              ({ id, proposal, council }) => (
                <Proposal
                  key={id.toString()}
                  id={id}
                  council={council}
                  proposal={proposal}
                  userIsMember={userIsMember}
                />
              ),
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

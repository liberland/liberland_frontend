import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Descriptions from 'antd/es/descriptions';
import { BN_ZERO } from '@polkadot/util';
import { formatDollars } from '../../../utils/walletHelpers';
import Button from '../../Button/Button';
import TreasurySpendingMotionModalWrapper from '../../Modals/TreasurySpendingMotionModal';
import Table from '../../Table';
import { congressActions } from '../../../redux/actions';
import {
  congressSelectors,
  blockchainSelectors,
} from '../../../redux/selectors';
import router from '../../../router';

export default function Treasury() {
  const dispatch = useDispatch();
  const treasuryInfo = useSelector(congressSelectors.treasury);
  const userIsMember = useSelector(congressSelectors.userIsMember);
  const currentBlockNumber = useSelector(blockchainSelectors.blockNumber);

  const approve = (id) => {
    dispatch(congressActions.approveTreasurySpend.call({ id }));
  };

  const unapprove = (id) => {
    dispatch(congressActions.unapproveTreasurySpend.call({ id }));
  };

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

  const mapper = (approved) => ({ id, proposal, council }) => {
    const { beneficiary, value } = proposal;
    return {
      id: id.toString(),
      beneficiary: beneficiary.toString(),
      value: `${formatDollars(value)} LLD`,
      approved: (
        <>
          {approved ? 'Yes' : 'No'}
          {council.length > 0 && (
            <Link to={router.congress.motions}>See change motion</Link>
          )}
        </>
      ),
      actions: userIsMember && (approved ? (
        <Button primary onClick={unapprove}>
          Unapprove
        </Button>
      ) : (
        <Button primary onClick={approve}>
          Approve
        </Button>
      )),
    };
  };

  return (
    <Table
      columns={[
        {
          Header: 'ID',
          accessor: 'id',
        },
        {
          Header: 'Beneficiary',
          accessor: 'beneficiary',
        },
        {
          Header: 'Value',
          accessor: 'value',
        },
        {
          Header: 'Approved',
          accessor: 'approved',
        },
        {
          Header: 'Actions',
          accessor: 'actions',
        },
      ]}
      data={[
        ...(treasuryInfo.proposals.approvals || []).map(mapper(true)),
        ...(treasuryInfo.proposals.proposals || []).map(mapper(false)),
      ]}
      footer={(
        <Descriptions
          title="Financials"
          layout="vertical"
          items={[
            {
              key: 'spend',
              label: 'Spend period',
              children: `${periodDays} days`,
            },
            {
              key: 'current',
              label: 'Current period ends in',
              children: `${periodRemainingDays} days`,
            },
            {
              key: 'total',
              label: 'Total budget',
              children: `${formatDollars(treasuryInfo.budget)} LLD`,
            },
            {
              key: 'remaining',
              label: 'Remaining budget',
              children: `${formatDollars(remainingBudget)} LLD`,
            },
            userIsMember && {
              key: 'motion',
              label: 'Spending motion',
              children: (
                <TreasurySpendingMotionModalWrapper
                  budget={remainingBudget}
                />
              ),
            },
          ].filter(Boolean)}
        />
      )}
    />
  );
}

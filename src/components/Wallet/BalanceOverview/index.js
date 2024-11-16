import React from 'react';
import PropTypes from 'prop-types';
import List from 'antd/es/list';
import Card from 'antd/es/card';

import { formatDollars, formatMerits } from '../../../utils/walletHelpers';
import SendLLDModalWrapper from '../../Modals/SendLLDModal';
import SendLLMModalWrapper from '../../Modals/SendLLMModal';
import RequestLLDModalWrapper from '../../Modals/RequestLLDModal';
import UnpoolLLMModalWrapper from '../../Modals/UnpoolModal';
import PolitipoolLLMModalWrapper from '../../Modals/PolitipoolModal';

function BalanceOverview({
  balances, liquidMerits, showStaked,
}) {
  const overviewInfo = React.useMemo(() => (showStaked
    ? [
      {
        amount: formatMerits(balances.liberstake.amount),
        title: 'PolitiPooled',
        currency: 'LLM',
        actions: [
          <UnpoolLLMModalWrapper />,
        ],
      },
      {
        amount: formatDollars(balances.polkastake.amount),
        title: 'Validator Staked',
        currency: 'LLD',
        actions: [

        ],
      },
    ]
    : []).concat([
    {
      amount: formatMerits(liquidMerits),
      title: 'Liquid',
      currency: 'LLM',
      actions: [
        <SendLLMModalWrapper />,
        <PolitipoolLLMModalWrapper />,
      ],
    },
    {
      amount: formatDollars(balances.liquidAmount.amount),
      title: 'Liquid',
      currency: 'LLD',
      actions: [
        <SendLLDModalWrapper />,
        <RequestLLDModalWrapper />,
      ],
    },
  ]), [balances.liberstake.amount, balances.liquidAmount.amount, balances.polkastake.amount, liquidMerits, showStaked]);

  return (
    <List
      grid={{ gutter: 10, column: overviewInfo.length }}
      dataSource={overviewInfo}
      renderItem={({
        actions,
        amount,
        currency,
        title,
      }) => (
        <Card actions={actions}>
          <Card.Meta title={title} description={`${amount} ${currency}`} />
        </Card>
      )}
    />
  );
}

BalanceOverview.defaultProps = {
  totalBalance: '0x0',
  balances: {},
  liquidMerits: 0,
  showStaked: true,
};

BalanceOverview.propTypes = {
  // eslint-disable-next-line
  totalBalance: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  showStaked: PropTypes.bool,
  balances: PropTypes.shape({
    liquidAmount: PropTypes.shape({
      // eslint-disable-next-line react/forbid-prop-types
      amount: PropTypes.object,
    }),
    liberstake: PropTypes.shape({
      amount: PropTypes.number,
    }),
    polkastake: PropTypes.shape({
      amount: PropTypes.number,
    }),
    liquidMerits: PropTypes.shape({
      amount: PropTypes.string,
    }),
  }),
  liquidMerits: PropTypes.string,
};

export default BalanceOverview;

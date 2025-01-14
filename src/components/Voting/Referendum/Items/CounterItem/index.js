import React from 'react';
import PropTypes from 'prop-types';
import Progress from 'antd/es/progress';
import { formatMerits } from '../../../../../utils/walletHelpers';

function CounterItem({ votedTotal, votes, isNay }) {
  const text = isNay ? 'Nay' : 'Aye';
  return (
    <Progress
      type="circle"
      format={() => `${text} - ${formatMerits(votes)} / ${formatMerits(votedTotal)}`}
      percent={votedTotal.div(votes).toString()}
    />
  );
}

CounterItem.defaultProps = {
  isNay: false,
};

CounterItem.propTypes = {
  votedTotal: PropTypes.number.isRequired,
  votes: PropTypes.number.isRequired,
  isNay: PropTypes.bool,
};

export default CounterItem;

import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import List from 'antd/es/list';
import { identitySelectors } from '../../../redux/selectors';
import CopyIconWithAddress from '../../CopyIconWithAddress';

function Voters({ voting }) {
  const names = useSelector(identitySelectors.selectorIdentityMotions);
  return (
    <List
      dataSource={voting}
      renderItem={(item) => {
        const id = item.toString();
        const identity = names?.[id]?.identity;
        return (
          <CopyIconWithAddress
            isTruncate
            name={identity?.name}
            legal={identity?.legal}
            address={id}
            showAddress
          />
        );
      }}
    />
  );
}

Voters.propTypes = {
  voting: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Voters;

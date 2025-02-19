import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import List from 'antd/es/list';
import Flex from 'antd/es/flex';
import { identitySelectors } from '../../../redux/selectors';
import CopyIconWithAddress from '../../CopyIconWithAddress';
import ColorAvatar from '../../ColorAvatar';
import truncate from '../../../utils/truncate';

function Voters({ voting }) {
  const names = useSelector(identitySelectors.selectorIdentityMotions);
  return (
    <List
      dataSource={voting}
      locale={{ emptyText: 'No voting record found' }}
      itemLayout="vertical"
      renderItem={(item) => {
        const id = item.toString();
        const identity = names?.[id]?.identity;
        return (
          <List.Item>
            <Flex wrap align="center" gap="10px">
              <ColorAvatar size={50} name={identity?.name || identity?.legal || id} />
              <Flex vertical gap="5px">
                <div className="description">
                  {truncate(identity?.legal || identity?.name || 'Unknown', 20)}
                </div>
                <CopyIconWithAddress
                  isTruncate
                  address={id}
                />
              </Flex>
            </Flex>
          </List.Item>
        );
      }}
    />
  );
}

Voters.propTypes = {
  voting: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Voters;

import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import List from 'antd/es/list';
import Avatar from 'antd/es/avatar';
import Flex from 'antd/es/flex';
import { identitySelectors } from '../../../redux/selectors';
import CopyIconWithAddress from '../../CopyIconWithAddress';
import { getAvatarParameters } from '../../../utils/avatar';

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
        const { color, text } = getAvatarParameters(
          identity?.name || identity?.legal || id,
        );
        return (
          <List.Item>
            <Flex wrap align="center" gap="10px">
              <Avatar size={50} style={{ backgroundColor: color }}>
                {text}
              </Avatar>
              <Flex vertical gap="5px">
                <div className="description">
                  {identity?.legal || identity?.name || 'Unknown'}
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

import React from 'react';
import List from 'antd/es/list';
import Flex from 'antd/es/flex';
import Card from 'antd/es/card';
import Descriptions from 'antd/es/descriptions';
import PropTypes from 'prop-types';
import ColorAvatar from '../../ColorAvatar';
import { holder } from './types';

function TopHoldersList({ holders }) {
  return (
    <List
      dataSource={holders}
      bordered
      renderItem={({
        address,
        display,
        total_lld_balance,
        frozen_lld_balance,
        index,
      }) => (
        <List.Item>
          <Flex wrap gap="20px">
            <List.Item.Meta
              avatar={<ColorAvatar size={32} name={display} />}
              title={display}
              description={address}
            />
            <Card>
              <Descriptions size="small" column={1}>
                <Descriptions.Item label="Position">
                  {index}
                </Descriptions.Item>
                <Descriptions.Item label="Total LLD">
                  {total_lld_balance}
                </Descriptions.Item>
                <Descriptions.Item label="Staked LLD">
                  {frozen_lld_balance}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Flex>
        </List.Item>
      )}
    />
  );
}

TopHoldersList.propTypes = {
  holders: PropTypes.arrayOf(holder),
};

export default TopHoldersList;

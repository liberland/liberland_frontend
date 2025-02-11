import React from 'react';
import PropTypes from 'prop-types';
import Flex from 'antd/es/flex';
import Card from 'antd/es/card';
import Tag from 'antd/es/tag';
import CopyIconWithAddress from '../CopyIconWithAddress';
import ColorAvatar from '../ColorAvatar';
import styles from './styles.module.scss';

function PersonBox({
  displayName,
  address,
  role,
}) {
  return (
    <Card
      size="small"
      className={styles.party}
    >
      <Card.Meta
        title={(
          <Flex wrap gap="15px" justify="space-between">
            {displayName}
            <Tag color={role.color} className={styles.tag}>
              {role.name}
            </Tag>
          </Flex>
        )}
        avatar={(
          <ColorAvatar name={displayName} />
        )}
        description={(
          <CopyIconWithAddress
            address={address}
          />
        )}
      />
    </Card>
  );
}

PersonBox.propTypes = {
  displayName: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  role: PropTypes.shape({
    color: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export default PersonBox;

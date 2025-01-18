import React from 'react';
import PropTypes from 'prop-types';
import Avatar from 'antd/es/avatar';
import Flex from 'antd/es/flex';
import List from 'antd/es/list';
import { useMediaQuery } from 'usehooks-ts';
import { getAvatarParameters } from '../../../utils/avatar';
import styles from './styles.module.scss';
import { tryFormatNumber } from '../../../utils/walletHelpers';
import CopyIconWithAddress from '../../CopyIconWithAddress';

function CompanyPersonas({
  data,
}) {
  const isLargerThanTable = useMediaQuery('(min-width: 1600px)');
  return (
    <List
      itemLayout={isLargerThanTable ? 'horizontal' : 'vertical'}
      grid={{ gutter: 16 }}
      dataSource={data}
      size="small"
      renderItem={({
        walletAddress,
        name,
        passportNumber,
        shares,
      }) => {
        const { color: ownerColor, text: ownerText } = getAvatarParameters(
          name || walletAddress,
        );
        return (
          <List.Item
            className={styles.listItem}
          >
            <List.Item.Meta
              avatar={(
                <Avatar style={{ backgroundColor: ownerColor }}>
                  {ownerText}
                </Avatar>
              )}
              title={name}
              description={(
                <CopyIconWithAddress address={walletAddress} isTruncate />
              )}
            />
            <Flex wrap gap="15px">
              <Flex gap="5px" vertical>
                <div className="description">
                  Passport number
                </div>
                <strong>
                  {passportNumber}
                </strong>
              </Flex>
              <Flex gap="5px" vertical>
                <div className="description">
                  Number of shares
                </div>
                <strong>
                  {tryFormatNumber(shares)}
                </strong>
              </Flex>
            </Flex>
          </List.Item>
        );
      }}
    />
  );
}

CompanyPersonas.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.array.isRequired,
};

export default CompanyPersonas;

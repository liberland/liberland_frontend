import React from 'react';
import PropTypes from 'prop-types';
import Flex from 'antd/es/flex';
import List from 'antd/es/list';
import Card from 'antd/es/card';
import { tryFormatNumber } from '../../../utils/walletHelpers';
import CopyIconWithAddress from '../../CopyIconWithAddress';
import ColorAvatar from '../../ColorAvatar';

function CompanyPersonas({
  data,
}) {
  return (
    <List
      itemLayout="horizontal"
      grid={{ gutter: 16 }}
      className="oneColumnList"
      dataSource={data || []}
      size="small"
      renderItem={({
        walletAddress,
        name,
        passportNumber,
        shares,
        signingAbilityConditions,
      }) => (
        <List.Item>
          <Card
            size="small"
          >
            <Card.Meta
              title={name}
              description={(
                <CopyIconWithAddress address={walletAddress} isTruncate />
              )}
              avatar={(
                <ColorAvatar name={name || walletAddress || 'P'} />
              )}
            />
            <Flex wrap gap="30px">
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
              {signingAbilityConditions && (
                <Flex gap="5px" vertical>
                  <div className="description">
                    Conditions / notes
                  </div>
                  <strong>
                    {signingAbilityConditions}
                  </strong>
                </Flex>
              )}
            </Flex>
          </Card>
        </List.Item>
      )}
    />
  );
}

CompanyPersonas.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.array,
};

export default CompanyPersonas;

import React from 'react';
import PropTypes from 'prop-types';
import Avatar from 'antd/es/avatar';
import Flex from 'antd/es/flex';
import List from 'antd/es/list';
import Card from 'antd/es/card';
import { getAvatarParameters } from '../../../utils/avatar';
import { tryFormatNumber } from '../../../utils/walletHelpers';
import CopyIconWithAddress from '../../CopyIconWithAddress';

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
      }) => {
        const { color: ownerColor, text: ownerText } = getAvatarParameters(
          name || walletAddress || 'P',
        );
        return (
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
                  <Avatar style={{ backgroundColor: ownerColor }}>
                    {ownerText}
                  </Avatar>
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
        );
      }}
    />
  );
}

CompanyPersonas.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.array,
};

export default CompanyPersonas;

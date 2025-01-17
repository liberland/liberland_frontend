import React from 'react';
import PropTypes from 'prop-types';
import Paragraph from 'antd/es/typography/Paragraph';
import Avatar from 'antd/es/avatar';
import Flex from 'antd/es/flex';
import List from 'antd/es/list';
import cx from 'classnames';
import Markdown from 'markdown-to-jsx';
import { useMediaQuery } from 'usehooks-ts';
import CopyIconWithAddress from '../../CopyIconWithAddress';
import CompanyActions from '../CompanyActions';
import styles from './styles.module.scss';
import { getAvatarParameters } from '../../../utils/avatar';
import truncate from '../../../utils/truncate';

function CompaniesCard({
  registries,
  type,
  hideOwner,
}) {
  const isLargerThanTable = useMediaQuery('(min-width: 1600px)');
  return (
    <List
      dataSource={registries?.filter((registered) => registered && !registered.invalid)}
      className={styles.companies}
      size="small"
      pagination={{ pageSize: 10 }}
      itemLayout={isLargerThanTable ? 'horizontal' : 'vertical'}
      renderItem={(registeredCompany) => {
        const owner = registeredCompany.principals?.[0]?.name?.value;
        const address = registeredCompany.principals?.[0]?.walletAddress?.value;
        const logo = registeredCompany.logoURL;
        const { color, text } = getAvatarParameters(owner);
        const buttons = (
          <CompanyActions
            registeredCompany={registeredCompany}
            type={type}
          />
        );
        return (
          <List.Item
            actions={[
              <Flex wrap gap="15px" className={styles.action}>
                {buttons}
              </Flex>,
            ]}
            className={styles.listItem}
          >
            <List.Item.Meta
              className={styles.meta}
              title={(
                <Flex align="center" gap="15px">
                  {logo && (
                    <Avatar size={54} src={logo} />
                  )}
                  <strong>
                    {registeredCompany.name}
                  </strong>
                </Flex>
              )}
            />
            <Flex wrap gap="15px" justify="space-between" flex={1}>
              <Paragraph
                ellipsis={{
                  rows: 2,
                }}
                className={cx('description', styles.preview)}
              >
                <Markdown>
                  {registeredCompany.purpose}
                </Markdown>
              </Paragraph>
              {!hideOwner && owner && (
                <Flex wrap gap="15px" className={styles.owner}>
                  <Avatar size={54} style={{ backgroundColor: color }}>
                    {text}
                  </Avatar>
                  <Flex vertical gap="5px" className={styles.ownerName}>
                    {owner && (
                      <>
                        <strong>
                          {truncate(owner, 20)}
                        </strong>
                        <CopyIconWithAddress address={address} isTruncate />
                      </>
                    )}
                  </Flex>
                </Flex>
              )}
            </Flex>
          </List.Item>
        );
      }}
    />
  );
}

CompaniesCard.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  registries: PropTypes.array.isRequired,
  type: PropTypes.oneOf(['requested', 'mine', 'all']),
  hideOwner: PropTypes.bool,
};

export default CompaniesCard;

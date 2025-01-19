import React, { useMemo } from 'react';
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
import { isValidUrl } from '../../../utils/url';
import { simplifyCompanyObject } from '../utils';

function CompaniesCard({
  registries,
  type,
  hideOwner,
}) {
  const isLargerThanHdScreen = useMediaQuery('(min-width: 1600px)');
  const simplify = useMemo(
    () => registries?.map((registry) => simplifyCompanyObject(registry || {})),
    [registries],
  );
  return (
    <List
      dataSource={simplify?.filter((registered) => registered && !registered.invalid)}
      className={styles.companies}
      size="small"
      pagination={{ pageSize: 10 }}
      itemLayout={isLargerThanHdScreen ? 'horizontal' : 'vertical'}
      renderItem={(registeredCompany) => {
        const owner = !hideOwner && registeredCompany.principals?.[0]?.name;
        const address = registeredCompany.principals?.[0]?.walletAddress;
        const logo = registeredCompany.logoURL;
        const { color: ownerColor, text: ownerText } = getAvatarParameters(owner);
        const { color: companyColor, text: companyText } = getAvatarParameters(
          registeredCompany.name || registeredCompany.id || 'C',
        );
        const buttons = (
          <CompanyActions
            registeredCompany={registeredCompany}
            type={type}
          />
        );
        const purpose = (
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
        );
        const companyLogoSize = isLargerThanHdScreen ? 54 : 40;
        const companyLogo = isValidUrl(logo) ? (
          <Avatar size={companyLogoSize} src={logo} className={styles.avatar} />
        ) : (
          <Avatar size={companyLogoSize} className={styles.avatar} style={{ backgroundColor: companyColor }}>
            {companyText}
          </Avatar>
        );
        if (isLargerThanHdScreen) {
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
                    {companyLogo}
                    {registeredCompany.name}
                  </Flex>
                )}
              />
              <Flex flex={1}>
                {purpose}
              </Flex>
              <Flex wrap gap="15px">
                {owner && (
                  <Flex wrap gap="15px" className={styles.owner}>
                    <Avatar size={54} style={{ backgroundColor: ownerColor }}>
                      {ownerText}
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
        }
        return (
          <List.Item
            className={styles.listItem}
          >
            <Flex gap="15px" justify="space-between">
              <Flex flex={1}>
                {companyLogo}
              </Flex>
              <Flex wrap gap="15px" justify="end">
                {buttons}
              </Flex>
            </Flex>
            <Flex vertical>
              <strong>
                {registeredCompany.name}
              </strong>
              {purpose}
            </Flex>
            {owner && (
              <Flex vertical gap="5px">
                <div className="description">
                  Company owner
                </div>
                <Flex wrap gap="5px" align="center">
                  <Avatar size={19} style={{ backgroundColor: ownerColor }} />
                  <CopyIconWithAddress address={address} name={owner} isTruncate />
                </Flex>
              </Flex>
            )}
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

import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Paragraph from 'antd/es/typography/Paragraph';
import Avatar from 'antd/es/avatar';
import Flex from 'antd/es/flex';
import List from 'antd/es/list';
import { isAddress } from '@polkadot/util-crypto';
import { useHistory } from 'react-router-dom';
import cx from 'classnames';
import Result from 'antd/es/result';
import Markdown from 'markdown-to-jsx';
import { useMediaQuery } from 'usehooks-ts';
import CopyIconWithAddress from '../../CopyIconWithAddress';
import CompanyActions from '../CompanyActions';
import styles from './styles.module.scss';
import truncate from '../../../utils/truncate';
import { isValidUrl } from '../../../utils/url';
import { simplifyCompanyObject } from '../utils';
import Button from '../../Button/Button';
import router from '../../../router';
import ColorAvatar from '../../ColorAvatar';

function CompaniesCard({
  registries,
  type,
  hideOwner,
}) {
  const history = useHistory();
  const isLargerThanHdScreen = useMediaQuery('(min-width: 1600px)');
  const simplify = useMemo(
    () => registries?.map((registry) => simplifyCompanyObject(registry || {})),
    [registries],
  );
  const dataSource = simplify?.filter((registered) => registered && !registered.invalid);
  const hasFooter = type === 'mine' && dataSource?.length > 0;
  return (
    <List
      dataSource={dataSource}
      className={cx(styles.companies, { listWithFooter: hasFooter })}
      size="small"
      pagination={dataSource?.length ? { pageSize: 10 } : false}
      itemLayout={isLargerThanHdScreen ? 'horizontal' : 'vertical'}
      footer={hasFooter ? (
        <Button
          primary
          onClick={() => history.push(router.companies.create)}
        >
          Register a new company
        </Button>
      ) : undefined}
      locale={{
        emptyText: <Result status={404} title="No companies found" />,
      }}
      renderItem={(registeredCompany) => {
        const owner = !hideOwner && registeredCompany.principals?.[0]?.name;
        const address = registeredCompany.principals?.[0]?.walletAddress;
        const logo = registeredCompany.logoURL;
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
        const companyLogoSize = isLargerThanHdScreen ? 40 : 32;
        const companyLogo = isValidUrl(logo) ? (
          <Avatar size={companyLogoSize} src={logo} className={styles.avatar} />
        ) : (
          <ColorAvatar
            size={companyLogoSize}
            className={styles.avatar}
            name={registeredCompany.name || registeredCompany.id || 'C'}
          />
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
                    {truncate(registeredCompany.name, 20)}
                  </Flex>
                )}
              />
              <Flex flex={1}>
                {purpose}
              </Flex>
              <Flex wrap gap="15px">
                {owner && (
                  <Flex wrap gap="15px" className={styles.owner}>
                    <ColorAvatar size={companyLogoSize} name={owner} />
                    <Flex vertical gap="5px" justify="center" className={styles.ownerName}>
                      {owner && (
                        <>
                          <strong>
                            {truncate(owner, 20)}
                          </strong>
                          {isAddress(address) && (
                            <div className="description">
                              <CopyIconWithAddress address={address} isTruncate />
                            </div>
                          )}
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
              <div className={styles.mobilePurpose}>
                {purpose}
              </div>
            </Flex>
            {owner && (
              <Flex vertical gap="5px">
                <div className="description">
                  Company owner
                </div>
                <Flex wrap gap="5px" align="center">
                  <ColorAvatar size={32} name={owner} />
                  {isAddress(address) ? (
                    <CopyIconWithAddress address={address} name={owner} isTruncate />
                  ) : (
                    <strong>
                      {truncate(owner, 20)}
                    </strong>
                  )}
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

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
import Markdown from 'react-markdown';
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
import { getDefaultPageSizes } from '../../../utils/pageSize';

function CompaniesCard({
  registries,
  type,
  hideOwner,
  getRelevantAssets,
  getRelevantPools,
}) {
  const history = useHistory();
  const isLargerThanHdScreen = useMediaQuery('(min-width: 1600px)');
  const simplify = useMemo(
    () => registries?.map((registry) => simplifyCompanyObject(registry || {})),
    [registries],
  );
  const dataSource = useMemo(() => {
    const filtered = simplify?.filter((registered) => registered && !registered.invalid);
    return type === 'all'
      ? filtered.sort((aCompany, bCompany) => {
        const [aAssets] = getRelevantAssets(aCompany);
        const [bAssets] = getRelevantAssets(bCompany);
        const aTradePool = aAssets?.length && getRelevantPools(aAssets[0]?.index)?.[0];
        const bTradePool = bAssets?.length && getRelevantPools(bAssets[0]?.index)?.[0];
        const aHasPool = aTradePool ? 1 : -1;
        const bHasPool = bTradePool ? 1 : -1;
        const aHasAssets = aAssets?.[0] ? 1 : -1;
        const bHasAssets = bAssets?.[0] ? 1 : -1;
        const aHasLogo = aCompany.logoURL ? 1 : -1;
        const bHasLogo = bCompany.logoURL ? 1 : -1;
        if (aHasPool !== bHasPool) {
          return bHasPool - aHasPool;
        }
        if (aHasAssets !== bHasAssets) {
          return bHasAssets - aHasAssets;
        }
        if (aHasLogo !== bHasLogo) {
          return bHasLogo - aHasLogo;
        }
        const aName = aCompany.name || aCompany.id.toString();
        const bName = bCompany.name || bCompany.id.toString();
        return bName.localeCompare(aName);
      })
      : filtered;
  }, [getRelevantAssets, getRelevantPools, simplify, type]);
  const hasFooter = type === 'mine' && dataSource?.length > 0;
  return (
    <List
      dataSource={dataSource}
      className={cx({ listWithFooter: hasFooter })}
      size="small"
      pagination={dataSource?.length ? getDefaultPageSizes(10) : false}
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
            getRelevantAssets={getRelevantAssets}
            getRelevantPools={getRelevantPools}
          />
        );
        const purpose = (
          <Paragraph
            ellipsis={{
              rows: 2,
            }}
            className={cx('description', styles.preview, styles.noHeading)}
          >
            <Markdown skipHtml>
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
                    {truncate(registeredCompany.name || '', 20)}
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
              <Flex vertical gap="7px">
                <div className={cx('description', styles.mobileOwner)}>
                  Company owner
                </div>
                <Flex wrap gap="5px" align="center">
                  <ColorAvatar size={24} fontSize={12} name={owner} />
                  <strong>
                    {truncate(owner, 20)}
                  </strong>
                  {isAddress(address) && (
                    <div className="description">
                      <CopyIconWithAddress address={address} isTruncate />
                    </div>
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
  getRelevantAssets: PropTypes.func,
  getRelevantPools: PropTypes.func,
};

export default CompaniesCard;

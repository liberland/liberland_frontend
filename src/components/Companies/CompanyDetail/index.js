import React, { useMemo } from 'react';
import Collapse from 'antd/es/collapse';
import Card from 'antd/es/card';
import List from 'antd/es/list';
import Result from 'antd/es/result';
import Avatar from 'antd/es/avatar';
import Flex from 'antd/es/flex';
import Divider from 'antd/es/divider';
import Space from 'antd/es/space';
import Alert from 'antd/es/alert';
import Tooltip from 'antd/es/tooltip';
import Title from 'antd/es/typography/Title';
import { useHistory } from 'react-router-dom';
import classNames from 'classnames';
import { useMediaQuery } from 'usehooks-ts';
import LeftOutlined from '@ant-design/icons/LeftOutlined';
import styles from './styles.module.scss';
import { useHideTitle } from '../../Layout/HideTitle';
import CopyInput from '../../CopyInput';
import { useCompanyAssets, useCompanyDataFromUrl, useTradePools } from '../hooks';
import CompanyActions from '../CompanyActions';
import Button from '../../Button/Button';
import router from '../../../router';
import { tryFormatDollars, tryFormatNumber } from '../../../utils/walletHelpers';
import CompanyPersonas from '../CompanyPersonas';
import { simplifyCompanyObject } from '../utils';
import ColorAvatar from '../../ColorAvatar';
import CompanyAsset from '../CompanyAsset';
import { isValidUrl } from '../../../utils/url';
import TradeButton from '../TradeButton';

function CompanyDetail() {
  const { mainDataObject, request } = useCompanyDataFromUrl();
  const isBiggerThanSmallScreen = useMediaQuery('(min-width: 992px)');
  const simplifiedDataObject = useMemo(() => simplifyCompanyObject(mainDataObject || {}), [mainDataObject]);
  const history = useHistory();
  const getRelevantAssets = useCompanyAssets();
  const getRelevantPools = useTradePools();
  const [connectedAssets, relevantAssets] = getRelevantAssets(simplifiedDataObject);

  useHideTitle();

  if (!simplifiedDataObject) {
    return <Result status="error" title="Company data invalid" />;
  }

  const fullLink = `${window.location.protocol}//${window.location.host}${router.companies.allCompanies}`;

  return (
    <>
      <Flex className={styles.top} wrap gap="15px" justify="space-between">
        <Button onClick={() => history.goBack()}>
          <LeftOutlined />
          <Space />
          Back
        </Button>
        <CopyInput buttonLabel="Copy link to company" value={fullLink} />
      </Flex>
      <Divider className={styles.divider} />
      <Flex wrap gap="15px" justify="space-between" align="center" className={styles.divider}>
        <Flex wrap gap="15px" align="center">
          {simplifiedDataObject.logoURL ? (
            <Avatar size={70} src={simplifiedDataObject.logoURL} />
          ) : (
            <ColorAvatar
              name={simplifiedDataObject.name || simplifiedDataObject.id || 'C'}
              size={70}
            />
          )}

          <Flex vertical gap="5px">
            <Flex wrap gap="15px">
              <div className="description">
                Company ID:
                {' '}
                {simplifiedDataObject.id || 'Unknown'}
              </div>
              <div className="description">
                Type:
                {' '}
                {simplifiedDataObject.type || 'Liberland'}
              </div>
            </Flex>
            <Title level={1} className={styles.title}>
              {simplifiedDataObject.name}
            </Title>
          </Flex>
        </Flex>
        <Flex wrap gap="15px">
          <CompanyActions
            registeredCompany={simplifiedDataObject}
            getRelevantAssets={getRelevantAssets}
            getRelevantPools={getRelevantPools}
            type={request ? 'detail-request' : 'detail'}
          />
        </Flex>
      </Flex>
      {request && (
        <>
          <Divider />
          <Alert type="warning" message="Company changes requested, pending approval" />
          <Divider />
        </>
      )}
      <Collapse
        collapsible="icon"
        defaultActiveKey={[
          'basic',
          'contacts',
          'address',
          'owners',
          'shareholders',
          'UBOs',
          'contracts',
          'assets',
          'connected',
        ]}
        items={[
          {
            key: 'basic',
            label: 'Basic information',
            children: (
              <Flex wrap gap="15px">
                <Card
                  className={styles.purpose}
                  title="Company description"
                  classNames={{ body: styles.description }}
                >
                  <Flex vertical gap="15px" justify="space-between" className={styles.description}>
                    <div className={styles.purposeText}>
                      {simplifiedDataObject.purpose || 'Unknown'}
                    </div>
                    <Flex className={styles.online} wrap gap="15px" justify="start">
                      {simplifiedDataObject
                        .onlineAddresses
                        ?.map(({ url, ...rest }) => ({
                          url: url.includes('@') ? `mailto:${url}` : url,
                          tooltip: url,
                          ...rest,
                        }))
                        .map(({ url, ...rest }) => ({
                          url: /^[+\s0-9]+$/gu.test(url) ? `tel:${url}` : url,
                          ...rest,
                        }))
                        ?.filter(({ url }) => url.startsWith('mailto:') || url.startsWith('tel:') || isValidUrl(url))
                        .map(({ description, url, tooltip }, index) => (
                          <Tooltip
                            placement="top"
                            showArrow={false}
                            trigger={['hover', 'click']}
                            overlay={<span>{tooltip}</span>}
                          >
                            <div>
                              <Button
                                primary={index === 0}
                                key={url}
                                href={url}
                              >
                                {description}
                              </Button>
                            </div>
                          </Tooltip>
                        ))}
                    </Flex>
                  </Flex>
                </Card>
                <Flex vertical gap="15px">
                  <Card title="Total capital amount">
                    {tryFormatDollars(simplifiedDataObject.totalCapitalAmount)}
                    {' '}
                    {simplifiedDataObject.totalCapitalCurrency}
                  </Card>
                  <Card title="Total number of shares">
                    {tryFormatNumber(simplifiedDataObject.numberOfShares)}
                    <div className="description">
                      Distributed amongst
                      {' '}
                      {simplifiedDataObject.shareholders?.length || 0}
                      {' '}
                      shareholder(s)
                    </div>
                  </Card>
                </Flex>
              </Flex>
            ),
          },
          {
            key: 'contacts',
            label: 'Contact information',
            children: (
              <List
                itemLayout="horizontal"
                grid={{ gutter: 16, column: 3 }}
                className="threeColumnList"
                dataSource={simplifiedDataObject.contact}
                size="small"
                renderItem={({ contact }, index) => (
                  <List.Item>
                    <Card
                      size="small"
                      classNames={{
                        header: styles.header,
                      }}
                      title={(
                        <div className="description">
                          {contact.includes('@') ? 'Email' : 'Telephone'}
                          {' '}
                          {index + 1}
                        </div>
                      )}
                    >
                      <strong>
                        {contact}
                      </strong>
                    </Card>
                  </List.Item>
                )}
              />
            ),
          },
          {
            key: 'address',
            label: 'Physical address(es)',
            children: (
              <List
                itemLayout="horizontal"
                grid={{ gutter: 16, column: 3 }}
                className="threeColumnList"
                dataSource={simplifiedDataObject.physicalAddresses}
                size="small"
                renderItem={({
                  description,
                  street,
                  city,
                  subdivision,
                  postalCode,
                  country,
                }, index) => (
                  <List.Item>
                    <Card
                      size="small"
                      classNames={{
                        header: styles.header,
                      }}
                      title={(
                        <div className="description">
                          Address
                          {' '}
                          {index + 1}
                          {index === 0 ? ' (primary)' : ''}
                        </div>
                      )}
                    >
                      <Flex vertical gap="5px">
                        <strong>
                          {street}
                          {subdivision ? `, ${subdivision}` : ''}
                        </strong>
                        <strong>
                          {city}
                          {', '}
                          {postalCode}
                        </strong>
                        <strong>
                          {country || ''}
                        </strong>
                        <strong>
                          {description || ''}
                        </strong>
                      </Flex>
                    </Card>
                  </List.Item>
                )}
              />
            ),
          },
          {
            key: 'owners',
            label: 'Company shareholder(s)',
            children: (
              <CompanyPersonas data={simplifiedDataObject.principals} />
            ),
          },
          {
            key: 'shareholders',
            label: 'Company shareholder(s)',
            children: (
              <CompanyPersonas data={simplifiedDataObject.shareholders} />
            ),
          },
          {
            key: 'UBOs',
            label: 'Ultimate beneficiary(es)',
            children: (
              <CompanyPersonas data={simplifiedDataObject.UBOs} />
            ),
          },
          {
            key: 'contracts',
            label: 'Relevant on-chain contract(s)',
            children: (
              <List
                itemLayout="horizontal"
                grid={{ gutter: 16, column: 3 }}
                className="threeColumnList"
                dataSource={simplifiedDataObject.relevantContracts}
                size="small"
                renderItem={({ contractId }) => {
                  const url = router.contracts.item.replace(':id', contractId);
                  const contractButton = (
                    <Button
                      onClick={() => history.push(url)}
                    >
                      View contract
                    </Button>
                  );
                  return (
                    <List.Item>
                      <Card
                        size="small"
                        classNames={{
                          header: classNames(styles.header, styles.view),
                          body: styles.noLine,
                        }}
                        extra={isBiggerThanSmallScreen ? contractButton : undefined}
                        title={`Contract ID: ${contractId}`}
                        actions={isBiggerThanSmallScreen ? undefined : [
                          <Flex wrap justify="center" gap="15px">{contractButton}</Flex>,
                        ]}
                      />
                    </List.Item>
                  );
                }}
              />
            ),
          },
          connectedAssets.length > 0 && {
            key: 'connected',
            label: 'Connected on-chain asset(s)',
            children: (
              <List
                itemLayout="horizontal"
                grid={{ gutter: 16, column: 3 }}
                className="threeColumnList"
                dataSource={connectedAssets}
                size="small"
                renderItem={({ index, metadata }) => {
                  const { name, symbol } = metadata;
                  return (
                    <List.Item>
                      <CompanyAsset
                        index={index}
                        name={name}
                        symbol={symbol}
                        logoURL={mainDataObject.logoURL}
                        actions={getRelevantPools(index)?.map(({
                          asset1,
                          asset2,
                          assetData1,
                          assetData2,
                        }) => {
                          const asset1Name = asset1 === 'Native' ? 'LLD' : assetData1.symbol;
                          const asset2Name = asset2 === 'Native' ? 'LLD' : assetData2.symbol;
                          const isStock = assetData1.isStock || assetData2.isStock;
                          return (
                            <TradeButton key={asset1 + asset2} asset1={asset1} asset2={asset2} isStock={isStock}>
                              Trade
                              {' '}
                              {asset1Name}
                              {' for '}
                              {asset2Name}
                            </TradeButton>
                          );
                        })}
                      />
                    </List.Item>
                  );
                }}
              />
            ),
          },
          relevantAssets.length > 0 && {
            key: 'assets',
            label: 'Relevant on-chain asset(s)',
            children: (
              <List
                itemLayout="horizontal"
                grid={{ gutter: 16, column: 3 }}
                className="threeColumnList"
                dataSource={relevantAssets}
                size="small"
                renderItem={({ index, metadata }) => {
                  const { name, symbol } = metadata;
                  return (
                    <List.Item>
                      <CompanyAsset index={index} name={name} symbol={symbol} />
                    </List.Item>
                  );
                }}
              />
            ),
          },
        ].filter(Boolean)}
      />
    </>
  );
}

export default CompanyDetail;

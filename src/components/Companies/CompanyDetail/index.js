import React, { useEffect, useMemo } from 'react';
import Collapse from 'antd/es/collapse';
import Card from 'antd/es/card';
import List from 'antd/es/list';
import Result from 'antd/es/result';
import Avatar from 'antd/es/avatar';
import Flex from 'antd/es/flex';
import Divider from 'antd/es/divider';
import Space from 'antd/es/space';
import Alert from 'antd/es/alert';
import Title from 'antd/es/typography/Title';
import { useHistory } from 'react-router-dom';
import classNames from 'classnames';
import { useMediaQuery } from 'usehooks-ts';
import { useDispatch, useSelector } from 'react-redux';
import ArrowLeft from '../../../assets/icons/arrow-left.svg';
import styles from './styles.module.scss';
import { useHideTitle } from '../../Layout/HideTitle';
import CopyInput from '../../CopyInput';
import { useCompanyDataFromUrl } from '../hooks';
import CompanyActions from '../CompanyActions';
import Button from '../../Button/Button';
import router from '../../../router';
import { tryFormatDollars, tryFormatNumber, valueToBN } from '../../../utils/walletHelpers';
import CompanyPersonas from '../CompanyPersonas';
import { simplifyCompanyObject } from '../utils';
import ColorAvatar from '../../ColorAvatar';
import { dexActions, walletActions } from '../../../redux/actions';
import { dexSelectors, walletSelectors } from '../../../redux/selectors';
import CompanyAsset from '../CompanyAsset';
import { isCompanyConnected } from '../../../utils/asset';
import TradeTokensModal from '../../Modals/TradeTokens';

function CompanyDetail() {
  const { mainDataObject: complexDataObject, request } = useCompanyDataFromUrl();
  const isBiggerThanSmallScreen = useMediaQuery('(min-width: 992px)');
  const mainDataObject = useMemo(() => simplifyCompanyObject(complexDataObject || {}), [complexDataObject]);
  const dispatch = useDispatch();
  const history = useHistory();
  const additionalAssets = useSelector(
    walletSelectors.selectorAdditionalAssets,
  );
  const dexs = useSelector(dexSelectors.selectorDex);
  const [connectedAssets, relevantAssets] = useMemo(() => {
    if (additionalAssets && complexDataObject) {
      return additionalAssets.reduce(([connected, relevant], asset) => {
        const { company } = asset;
        if (!company || company.id?.toString() !== complexDataObject.id?.toString()) {
          return [connected, relevant];
        }
        if (isCompanyConnected(asset)) {
          connected.push(asset);
        } else {
          relevant.push(asset);
        }
        return [connected, relevant];
      }, [[], []]);
    }
    return [[], []];
  }, [additionalAssets, complexDataObject]);

  useEffect(() => {
    dispatch(walletActions.getAdditionalAssets.call());
  }, [dispatch]);
  useEffect(() => {
    dispatch(dexActions.getPools.call());
  }, [dispatch]);
  useHideTitle();

  if (!mainDataObject) {
    return <Result status="error" title="Company data invalid" />;
  }

  const fullLink = `${window.location.protocol}//${window.location.host}${router.companies.allCompanies}`;

  return (
    <>
      <Flex className={styles.top} wrap gap="15px" justify="space-between">
        <Button onClick={() => history.goBack()}>
          <Avatar src={ArrowLeft} size={12} shape="square" />
          <Space />
          Back
        </Button>
        <CopyInput buttonLabel="Copy link to company" value={fullLink} />
      </Flex>
      <Divider className={styles.divider} />
      <Flex wrap gap="15px" justify="space-between" align="center" className={styles.divider}>
        <Flex wrap gap="15px" align="center">
          {mainDataObject.logoURL ? (
            <Avatar size={70} src={mainDataObject.logoURL} />
          ) : (
            <ColorAvatar
              name={mainDataObject.name || mainDataObject.id || 'C'}
              size={70}
            />
          )}

          <Flex vertical gap="5px">
            <Flex wrap gap="15px">
              <div className="description">
                Company ID:
                {' '}
                {mainDataObject.id || 'Unknown'}
              </div>
              <div className="description">
                Type:
                {' '}
                {mainDataObject.type || 'Liberland'}
              </div>
            </Flex>
            <Title level={1} className={styles.title}>
              {mainDataObject.name}
            </Title>
          </Flex>
        </Flex>
        <Flex wrap gap="15px">
          <CompanyActions registeredCompany={mainDataObject} type={request ? 'detail-request' : 'detail'} />
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
                  actions={[
                    <Flex className={styles.online} wrap gap="15px" justify="start">
                      {mainDataObject.onlineAddresses?.map(
                        ({ description, url }, index) => (
                          <Button
                            primary={index === 0}
                            key={url}
                            onClick={() => {
                              window.location.href = url;
                            }}
                          >
                            {description}
                          </Button>
                        ),
                      )}
                    </Flex>,
                  ]}
                >
                  <div className={styles.purposeText}>
                    {mainDataObject.purpose || 'Unknown'}
                  </div>
                </Card>
                <Flex vertical gap="15px">
                  <Card title="Total capital amount">
                    {tryFormatDollars(mainDataObject.totalCapitalAmount)}
                    {' '}
                    {mainDataObject.totalCapitalCurrency}
                  </Card>
                  <Card title="Total number of shares">
                    {tryFormatNumber(mainDataObject.numberOfShares)}
                    <div className="description">
                      Distributed amongst
                      {' '}
                      {mainDataObject.shareholders?.length || 0}
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
                dataSource={mainDataObject.contact}
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
                dataSource={mainDataObject.physicalAddresses}
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
              <CompanyPersonas data={mainDataObject.principals} />
            ),
          },
          {
            key: 'shareholders',
            label: 'Company shareholder(s)',
            children: (
              <CompanyPersonas data={mainDataObject.shareholders} />
            ),
          },
          {
            key: 'UBOs',
            label: 'Ultimate beneficiary(es)',
            children: (
              <CompanyPersonas data={mainDataObject.UBOs} />
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
                dataSource={mainDataObject.relevantContracts}
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
                  const { poolsData, assetsPoolsData } = dexs || {};
                  const relevantPools = poolsData?.filter(
                    ({ asset1, asset2 }) => asset1 === index?.toString() || asset2 === index?.toString(),
                  ).sort(({ lpToken: aToken }, { lpToken: bToken }) => {
                    const aLiq = valueToBN(assetsPoolsData[aToken]?.supply || '0');
                    const bLiq = valueToBN(assetsPoolsData[bToken]?.supply || '0');
                    return bLiq.gt(aLiq) ? 1 : -1;
                  });
                  return (
                    <List.Item>
                      <CompanyAsset
                        index={index}
                        name={name}
                        symbol={symbol}
                        logoURL={complexDataObject.logoURL}
                        actions={relevantPools?.map(({
                          asset1,
                          asset2,
                          assetData1,
                          assetData2,
                        }) => {
                          const asset1Name = asset1 === 'Native' ? 'LLD' : assetData1.symbol;
                          const asset2Name = asset2 === 'Native' ? 'LLD' : assetData2.symbol;
                          const isStock = assetData1.isStock || assetData2.isStock;
                          const modalLink = TradeTokensModal.createHash({ asset1, asset2 });
                          return (
                            <Button
                              primary
                              key={modalLink}
                              onClick={() => history.push(
                                `${isStock ? router.wallet.stockExchange : router.wallet.exchange}#${modalLink}`,
                              )}
                            >
                              Trade
                              {' '}
                              {asset1Name}
                              {' for '}
                              {asset2Name}
                            </Button>
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

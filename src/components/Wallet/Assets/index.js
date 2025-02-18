import React, { useEffect, useMemo } from 'react';
import { useMediaQuery } from 'usehooks-ts';
import Popover from 'antd/es/popover';
import Flex from 'antd/es/flex';
import Card from 'antd/es/card';
import List from 'antd/es/list';
import Spin from 'antd/es/spin';
import Descriptions from 'antd/es/descriptions';
import { useSelector, useDispatch } from 'react-redux';
import groupBy from 'lodash/groupBy';
import {
  walletSelectors,
  blockchainSelectors,
  identitySelectors,
  registriesSelectors,
} from '../../../redux/selectors';
import { identityActions, registriesActions, walletActions } from '../../../redux/actions';
import CopyIconWithAddress from '../../CopyIconWithAddress';
import Button from '../../Button/Button';
import Table from '../../Table';
import { formatCustom } from '../../../utils/walletHelpers';
import { useStockContext } from '../StockContext';
import styles from './styles.module.scss';
import AssetsMenuModal from './AssetsModal/AssetsMenu';
import CreateOrUpdateAssetModal from './AssetsModal/CreateOrUpdateAsset';
import CurrencyIcon from '../../CurrencyIcon';
import truncate from '../../../utils/truncate';
import CompanyDetail from './CompanyDisplay';
import ColorAvatar from '../../ColorAvatar';

function Assets() {
  const userWalletAddress = useSelector(
    blockchainSelectors.userWalletAddressSelector,
  );
  const additionalAssets = useSelector(
    walletSelectors.selectorAdditionalAssets,
  );
  const assetDetails = useSelector(walletSelectors.selectorAssetsDetails);
  const identities = useSelector(identitySelectors.selectorIdentityMotions);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(walletActions.getAdditionalAssets.call());
    dispatch(registriesActions.getOfficialRegistryEntries.call());
  }, [dispatch]);

  const allRegistries = useSelector(registriesSelectors.allRegistries)?.officialRegistryEntries;
  const mappedRegistries = useMemo(() => (allRegistries ? groupBy(allRegistries, 'id') : {}), [allRegistries]);

  const ids = useMemo(
    () => additionalAssets?.map((asset) => asset.index),
    [additionalAssets],
  );

  useEffect(() => {
    if (ids?.length) {
      dispatch(walletActions.getAssetsDetails.call(ids));
    }
  }, [dispatch, ids]);

  useEffect(() => {
    dispatch(identityActions.getIdentityMotions.call(
      assetDetails.flatMap(({
        admin,
        owner,
        issuer,
        freezer,
      }) => [
        admin,
        owner,
        issuer,
        freezer,
      ].filter(Boolean)),
    ));
  }, [dispatch, assetDetails]);

  const isBiggerThanLargeScreen = useMediaQuery('(min-width: 1200px)');
  const { isStock } = useStockContext();
  const formatted = useMemo(
    () => additionalAssets?.map((asset, index) => {
      const symbol = (
        <Flex wrap gap="7px" align="center">
          {asset.metadata.symbol}
          <CurrencyIcon size={20} symbol={asset.metadata.symbol} />
        </Flex>
      );
      const getName = (wallet) => (
        identities?.[wallet]?.identity.legal
          || identities?.[wallet]?.identity.name
      );
      const getIdentity = (address) => (
        <Flex wrap gap="7px" align="center">
          <ColorAvatar name={getName(address) || 'U'} size={40} />
          <Flex vertical gap="7px">
            <strong>
              {truncate(getName(address) || 'Unknown', isBiggerThanLargeScreen ? 20 : 15)}
            </strong>
            <div className="description">
              <CopyIconWithAddress address={address} truncateBy={{ bigScreen: 12, smallScreen: 7 }} />
            </div>
          </Flex>
        </Flex>
      );

      const { id: companyId, name: companyName, logoURL } = mappedRegistries[asset.companyId]?.[0] || {};
      const spanSize = isBiggerThanLargeScreen ? 12 : 24;
      const details = (
        <>
          <Descriptions.Item span={spanSize} label="Admin">
            {assetDetails?.[index]?.admin && getIdentity(assetDetails?.[index]?.admin)}
          </Descriptions.Item>
          <Descriptions.Item span={spanSize} label="Owner">
            {assetDetails?.[index]?.owner && getIdentity(assetDetails?.[index]?.owner)}
          </Descriptions.Item>
          <Descriptions.Item span={spanSize} label="Issuer">
            {assetDetails?.[index]?.issuer && getIdentity(assetDetails?.[index]?.issuer)}
          </Descriptions.Item>
          <Descriptions.Item span={spanSize} label="Freezer">
            {assetDetails?.[index]?.freezer && getIdentity(assetDetails?.[index]?.freezer)}
          </Descriptions.Item>
          <Descriptions.Item span={spanSize} label="Supply">
            <Flex wrap gap="7px" align="center">
              {formatCustom(
                assetDetails?.[index]?.supply ?? '0',
                parseInt(asset.metadata.decimals),
              )}
              {symbol}
            </Flex>
          </Descriptions.Item>
          <Descriptions.Item span={spanSize} label="Related company">
            {asset.companyId ? (
              <CompanyDetail
                id={companyId}
                size={isBiggerThanLargeScreen ? 32 : 20}
                logo={logoURL}
                name={companyName}
              />
            ) : 'None'}
          </Descriptions.Item>
        </>
      );
      const isAdmin = assetDetails?.[index]?.admin === userWalletAddress;
      const isOwner = assetDetails?.[index]?.owner === userWalletAddress;
      const isIssuer = assetDetails?.[index]?.issuer === userWalletAddress;
      return (
        {
          ...asset,
          ...asset.metadata,
          ...assetDetails[index]?.identity,
          symbol,
          details: isBiggerThanLargeScreen ? (
            <Popover
              content={(
                <Descriptions column={24} className={styles.details} layout="vertical" size="small" bordered>
                  {details}
                </Descriptions>
              )}
              title={(
                <div className={styles.desktopDetails}>
                  Details
                </div>
              )}
              trigger="click"
            >
              <Button>
                Details
              </Button>
            </Popover>
          ) : (
            <Descriptions column={24} layout="vertical" size="small" bordered>
              <Descriptions.Item span={spanSize} label="Name">
                {asset.metadata.name}
              </Descriptions.Item>
              {details}
            </Descriptions>
          ),
          actions: isAdmin || isOwner || isIssuer ? (
            <AssetsMenuModal
              isAdmin={isAdmin}
              isOwner={isOwner}
              isIssuer={isIssuer}
              assetId={asset.index}
              isStock={isStock}
              defaultValues={{
                admin: assetDetails?.[index]?.admin,
                balance: assetDetails?.[index]?.minBalance,
                companyId: asset.companyId,
                decimals: parseInt(asset.metadata.decimals) || 0,
                freezer: assetDetails?.[index]?.freezer,
                id: asset.index,
                issuer: assetDetails?.[index]?.issuer,
                name: asset.metadata.name,
                symbol: asset.metadata.symbol,
              }}
            />
          ) : isBiggerThanLargeScreen && <div className="description">None</div>,
        }
      );
    }).filter(({ isStock: assetIsStock }) => assetIsStock === isStock) || [],
    [additionalAssets, mappedRegistries, assetDetails, isBiggerThanLargeScreen, userWalletAddress, identities, isStock],
  );

  if (!assetDetails || !additionalAssets) {
    return <Spin />;
  }

  const title = (
    <>
      {isStock ? 'Stocks' : 'Assets'}
      {' '}
      on the Liberland blockchain.
      {' '}
      <a href="https://docs.liberland.org/blockchain/for-citizens/assets-and-stocks">
        Learn more
      </a>
    </>
  );

  return (
    <Flex vertical gap="20px">
      {isBiggerThanLargeScreen ? (
        <Table
          data={formatted}
          title={title}
          columns={[
            {
              Header: 'Name',
              accessor: 'name',
            },
            {
              Header: 'Symbol',
              accessor: 'symbol',
            },
            {
              Header: 'Details',
              accessor: 'details',
            },
            {
              Header: 'Actions',
              accessor: 'actions',
            },
          ]}
        />
      ) : (
        <List
          dataSource={formatted}
          className="centeredList"
          header={title}
          pagination={formatted.length ? { pageSize: 10 } : undefined}
          renderItem={({
            symbol,
            details,
            actions,
          }) => (
            <List.Item>
              <Card
                title={symbol}
                actions={[
                  <Flex wrap gap="15px" className={styles.actions}>
                    {actions}
                  </Flex>,
                ]}
                className={styles.card}
              >
                {details}
              </Card>
            </List.Item>
          )}
        />
      )}
      <Flex wrap gap="15px">
        <CreateOrUpdateAssetModal isCreate isStock={isStock} />
      </Flex>
    </Flex>
  );
}

export default Assets;

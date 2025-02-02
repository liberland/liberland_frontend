import React, { useEffect, useMemo } from 'react';
import { useMediaQuery } from 'usehooks-ts';
import Paragraph from 'antd/es/typography/Paragraph';
import Popover from 'antd/es/popover';
import Flex from 'antd/es/flex';
import Card from 'antd/es/card';
import List from 'antd/es/list';
import Descriptions from 'antd/es/descriptions';
import { useSelector, useDispatch } from 'react-redux';
import { walletSelectors, blockchainSelectors, identitySelectors } from '../../../redux/selectors';
import { identityActions, walletActions } from '../../../redux/actions';
import CopyIconWithAddress from '../../CopyIconWithAddress';
import Button from '../../Button/Button';
import Table from '../../Table';
import { formatCustom } from '../../../utils/walletHelpers';
import CreateOrUpdateAssetFormModalWrapper from './CreateOrUpdateAssetForm';
import ActionsMenuModalWrapper from './ActionsMenu';
import { useStockContext } from '../StockContext';
import styles from './styles.module.scss';
import CurrencyIcon from '../../CurrencyIcon';

function Assets() {
  const userWalletAddress = useSelector(
    blockchainSelectors.userWalletAddressSelector,
  );
  const additionalAssets = useSelector(walletSelectors.selectorAdditionalAssets);
  const assetDetails = useSelector(walletSelectors.selectorAssetsDetails);
  const identities = useSelector(identitySelectors.selectorIdentityMotions);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(walletActions.getAdditionalAssets.call());
  }, [dispatch]);

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

  const isBiggerThanLargeScreen = useMediaQuery('(min-width: 1025px)');
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
      const details = (
        <>
          <Descriptions.Item label="Admin">
            {assetDetails?.[index]?.admin && (
              <CopyIconWithAddress
                address={assetDetails[index].admin}
                name={getName(assetDetails[index].admin)}
              />
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Owner">
            {assetDetails?.[index]?.owner && (
              <CopyIconWithAddress
                address={assetDetails?.[index]?.owner}
                name={getName(assetDetails[index].owner)}
              />
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Issuer">
            {assetDetails?.[index]?.issuer && (
              <CopyIconWithAddress
                address={assetDetails?.[index]?.issuer}
                name={getName(assetDetails[index].issuer)}
              />
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Freezer">
            {assetDetails?.[index]?.freezer && (
              <CopyIconWithAddress
                address={assetDetails?.[index]?.freezer}
                name={getName(assetDetails[index].freezer)}
              />
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Supply">
            <Flex wrap gap="7px" align="center">
              {formatCustom(
                assetDetails?.[index]?.supply ?? '0',
                parseInt(asset.metadata.decimals),
              )}
              {symbol}
            </Flex>
          </Descriptions.Item>
        </>
      );
      return (
        {
          ...asset,
          ...asset.metadata,
          ...assetDetails[index]?.identity,
          symbol,
          details: isBiggerThanLargeScreen ? (
            <Popover
              content={(
                <Descriptions className={styles.details} layout="vertical" size="small">
                  {details}
                </Descriptions>
              )}
              title="Details"
              trigger="click"
            >
              <Button>
                Details
              </Button>
            </Popover>
          ) : (
            <Descriptions layout="vertical" size="small" bordered>
              <Descriptions.Item label="Name">
                {asset.metadata.name}
              </Descriptions.Item>
              {details}
            </Descriptions>
          ),
          actions: (
            <ActionsMenuModalWrapper
              isAdmin={assetDetails?.[index]?.admin === userWalletAddress}
              isOwner={assetDetails?.[index]?.owner === userWalletAddress}
              isIssuer={assetDetails?.[index]?.issuer === userWalletAddress}
              assetId={asset.index}
              defaultValues={{
                admin: assetDetails?.[index]?.admin,
                balance: assetDetails?.[index]?.minBalance,
                decimals: parseInt(asset.metadata.decimals) || 0,
                freezer: assetDetails?.[index]?.freezer,
                id: asset.index,
                issuer: assetDetails?.[index]?.issuer,
                name: asset.metadata.name,
                symbol: asset.metadata.symbol,
              }}
            />
          ),
        }
      );
    }).filter(({ isStock: assetIsStock }) => assetIsStock === isStock) || [],
    [isBiggerThanLargeScreen, identities, additionalAssets, assetDetails, userWalletAddress, isStock],
  );

  if (!assetDetails || !additionalAssets || !userWalletAddress) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Paragraph>
        <p>
          {isStock ? 'Stocks' : 'Assets'}
          {' '}
          on the Liberland blockchain.
          {' '}
          <a href="https://docs.liberland.org/blockchain/for-citizens/assets-and-stocks">
            Learn more
          </a>
        </p>
      </Paragraph>
      {isBiggerThanLargeScreen ? (
        <Table
          data={formatted}
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
      <CreateOrUpdateAssetFormModalWrapper isCreate />
    </>
  );
}

export default Assets;

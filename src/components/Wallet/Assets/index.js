import React, { useEffect, useMemo } from 'react';
import { useMediaQuery } from 'usehooks-ts';
import Paragraph from 'antd/es/typography/Paragraph';
import Popover from 'antd/es/popover';
import Descriptions from 'antd/es/descriptions';
import { useSelector, useDispatch } from 'react-redux';
import { walletSelectors, blockchainSelectors } from '../../../redux/selectors';
import { walletActions } from '../../../redux/actions';
import Button from '../../Button/Button';
import Table from '../../Table';
import { formatCustom } from '../../../utils/walletHelpers';
import { useStockContext } from '../StockContext';
import styles from './styles.module.scss';
import AssetsMenuModal from './AssetsModal/AssetsMenu';
import CreateOrUpdateAssetModal from './AssetsModal/CreateOrUpdateAsset';

function Assets() {
  const userWalletAddress = useSelector(
    blockchainSelectors.userWalletAddressSelector,
  );
  const additionalAssets = useSelector(
    walletSelectors.selectorAdditionalAssets,
  );
  const assetDetails = useSelector(walletSelectors.selectorAssetsDetails);
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

  const isBiggerThanLargeScreen = useMediaQuery('(min-width: 1025px)');
  const { isStock } = useStockContext();
  const formatted = useMemo(
    () => additionalAssets
      ?.map((asset, index) => ({
        ...asset,
        ...asset.metadata,
        ...assetDetails[index]?.identity,
        details: (
          <Popover
            content={(
              <Descriptions
                className={styles.details}
                layout="vertical"
                size="small"
              >
                <Descriptions.Item label="Admin">
                  {assetDetails?.[index]?.admin}
                </Descriptions.Item>
                <Descriptions.Item label="Owner">
                  {assetDetails?.[index]?.owner}
                </Descriptions.Item>
                <Descriptions.Item label="Issuer">
                  {assetDetails?.[index]?.issuer}
                </Descriptions.Item>
                <Descriptions.Item label="Freezer">
                  {assetDetails?.[index]?.freezer}
                </Descriptions.Item>
                <Descriptions.Item label="Supply">
                  {formatCustom(
                    assetDetails?.[index]?.supply ?? '0',
                    parseInt(asset.metadata.decimals),
                  )}
                  {' '}
                  {asset.metadata.symbol}
                </Descriptions.Item>
              </Descriptions>
              )}
            title="Details"
            trigger="click"
          >
            <Button>Details</Button>
          </Popover>
        ),
        actions: (
          <AssetsMenuModal
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
      }))
      .filter(({ isStock: assetIsStock }) => assetIsStock === isStock) || [],
    [additionalAssets, assetDetails, userWalletAddress, isStock],
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
      <Table
        data={formatted}
        columns={
          isBiggerThanLargeScreen
            ? [
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
            ]
            : [
              {
                Header: 'Symbol',
                accessor: 'symbol',
              },
              {
                Header: 'Owner',
                accessor: 'owner',
              },
              {
                Header: 'Actions',
                accessor: 'actions',
              },
            ]
        }
      />
      <CreateOrUpdateAssetModal isCreate />
    </>
  );
}

export default Assets;

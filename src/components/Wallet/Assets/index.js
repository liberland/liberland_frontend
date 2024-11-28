import React, { useMemo } from 'react';
import { useMediaQuery } from 'usehooks-ts';
import Paragraph from 'antd/es/typography/Paragraph';
import { useSelector, useDispatch } from 'react-redux';
import { walletSelectors, blockchainSelectors } from '../../../redux/selectors';
import { walletActions } from '../../../redux/actions';
import Table from '../../Table';
import { formatCustom } from '../../../utils/walletHelpers';
import UpdateOrCreateAssetFormModalWrapper from './UpdateOrCreateAssetForm';
import ActionsMenuModalWrapper from './ActionsMenu';
import { useStockContext } from '../StockContext';

function Assets() {
  const userWalletAddress = useSelector(
    blockchainSelectors.userWalletAddressSelector,
  );
  const additionalAssets = useSelector(walletSelectors.selectorAdditionalAssets);
  const assetDetails = useSelector(walletSelectors.selectorAssetsDetails);
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(walletActions.getAdditionalAssets.call());
  }, [dispatch]);

  const ids = useMemo(
    () => additionalAssets?.map((asset) => asset.index),
    [additionalAssets],
  );

  React.useEffect(() => {
    if (ids?.length) {
      dispatch(walletActions.getAssetsDetails.call(ids));
    }
  }, [dispatch, ids]);

  const isBiggerThanDesktop = useMediaQuery('(min-width: 1025px)');
  const { isStock } = useStockContext();
  const formatted = useMemo(
    () => additionalAssets?.map((asset, index) => (
      {
        ...asset,
        ...asset.metadata,
        ...assetDetails[index]?.identity,
        supply: `${
          formatCustom(
            assetDetails?.[index]?.supply ?? '0',
            parseInt(asset.metadata.decimals),
          )} ${asset.metadata.symbol}`,
        actions: (
          <ActionsMenuModalWrapper
            isAdmin={assetDetails?.[index]?.admin === userWalletAddress}
            isOwner={assetDetails?.[index]?.owner === userWalletAddress}
            isIssuer={assetDetails?.[index]?.issuer === userWalletAddress}
            assetId={asset.index}
            defaultValues={{
              admin: assetDetails?.[index]?.admin,
              balance: assetDetails?.[index]?.minBalance,
              decimals: asset.metadata.decimals,
              freezer: assetDetails?.[index]?.freezer,
              id: asset.index,
              issuer: assetDetails?.[index]?.issuer,
              name: asset.metadata.name,
              symbol: asset.metadata.symbol,
            }}
          />
        ),
      }
    )).filter(({ isStock: assetIsStock }) => assetIsStock === isStock) || [],
    [additionalAssets, assetDetails, userWalletAddress, isStock],
  );

  if (!assetDetails || !additionalAssets || !userWalletAddress) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Paragraph>
        {isStock ? 'Here lies stock description' : 'Here lies asset description'}
      </Paragraph>
      <Table
        data={formatted}
        columns={isBiggerThanDesktop ? [
          {
            Header: 'Name',
            accessor: 'name',
          },
          {
            Header: 'Symbol',
            accessor: 'symbol',
          },
          {
            Header: 'Owner',
            accessor: 'owner',
          },
          {
            Header: 'Admin',
            accessor: 'admin',
          },
          {
            Header: 'Issuer',
            accessor: 'issuer',
          },
          {
            Header: 'Freezer',
            accessor: 'freezer',
          },
          {
            Header: 'Supply',
            accessor: 'supply',
          },
          {
            Header: 'Actions',
            accessor: 'actions',
          },
        ] : [
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
        ]}
      />
      <UpdateOrCreateAssetFormModalWrapper isCreate />
    </>
  );
}

export default Assets;

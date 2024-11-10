import React from 'react';
import { useMediaQuery } from 'usehooks-ts';
import { useSelector, useDispatch } from 'react-redux';
import cx from 'classnames';
import { walletSelectors, blockchainSelectors } from '../../../redux/selectors';
import { walletActions } from '../../../redux/actions';
import stylesPage from '../../../utils/pagesBase.module.scss';
import Card from '../../Card';
import Table from '../../Table';
import styles from './styles.module.scss';
import { formatCustom } from '../../../utils/walletHelpers';
import UpdateOrCreateAssetFormModalWrapper from './UpdateOrCreateAssetForm';
import ActionsMenuModalWrapper from './ActionsMenu';

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

  const ids = React.useMemo(
    () => additionalAssets?.map((asset) => asset.index),
    [additionalAssets],
  );

  React.useEffect(() => {
    if (ids?.length) {
      dispatch(walletActions.getAssetsDetails.call(ids));
    }
  }, [dispatch, ids]);

  const isBiggerThanDesktop = useMediaQuery('(min-width: 1025px)');

  if (!assetDetails || !additionalAssets || !userWalletAddress) {
    return <div>Loading...</div>;
  }

  const formatted = additionalAssets.map((asset, index) => (
    {
      ...asset,
      ...asset.metadata,
      ...assetDetails[index]?.identity,
      supply: `${
        formatCustom(assetDetails[index]?.supply ?? '0', parseInt(asset.metadata.decimals))} ${asset.metadata.symbol}`,
      actions: (
        <ActionsMenuModalWrapper
          isFreezer={assetDetails[index]?.freezer === userWalletAddress}
          isAdmin={assetDetails[index]?.admin === userWalletAddress}
          isOwner={assetDetails[index]?.freezer === userWalletAddress}
          isIssuer={assetDetails[index]?.freezer === userWalletAddress}
          assetId={asset.index}
          defaultValues={{
            admin: assetDetails[index]?.admin,
            balance: assetDetails[index]?.balance,
            decimals: asset.metadata.decimals,
            freezer: assetDetails[index]?.freezer,
            id: asset.index,
            issuer: assetDetails[index]?.issuer,
            name: asset.metadata.name,
            symbol: asset.metadata.symbol,
          }}
        />
      ),
    }
  ));

  return (
    <div className={stylesPage.contentWrapper}>
      <div className={stylesPage.sectionWrapper}>
        <Card className={cx(stylesPage.overviewWrapper, styles.cardWrapper)} title="Info">
          <p>
            Here lies assets description
          </p>
        </Card>
        <br />
        <Card className={cx(stylesPage.overviewWrapper, styles.cardWrapper)} title="Assets overview">
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
        </Card>
      </div>
    </div>
  );
}

export default Assets;

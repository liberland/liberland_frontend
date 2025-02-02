import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Alert from 'antd/es/alert';
import List from 'antd/es/list';
import Spin from 'antd/es/spin';
import { nftsActions } from '../../../redux/actions';
import { blockchainSelectors, nftsSelectors } from '../../../redux/selectors';
import ItemNft from '../ItemNft';

function OnSale() {
  const dispatch = useDispatch();
  const userWalletAddress = useSelector(
    blockchainSelectors.userWalletAddressSelector,
  );
  const nftsOnSale = useSelector(nftsSelectors.nftsOnSale);

  useEffect(() => {
    dispatch(nftsActions.getNftsOnSale.call(userWalletAddress));
  }, [dispatch, userWalletAddress]);

  if (!nftsOnSale) {
    return <Spin />;
  }

  return nftsOnSale.length ? (
    <List
      dataSource={nftsOnSale}
      grid={{
        gutter: 16,
      }}
      className="centeredList"
      renderItem={({
        collectionId,
        nftId,
        collectionMetadata,
        itemMetadata,
      }) => (
        <ItemNft
          key={collectionId + nftId}
          itemMetadata={itemMetadata}
          collectionId={collectionId}
          nftId={nftId}
          collectionMetadata={collectionMetadata}
          isOnSaleItem
        />
      )}
    />
  ) : <Alert type="info" message="There are no NFTs on sale" />;
}

export default OnSale;

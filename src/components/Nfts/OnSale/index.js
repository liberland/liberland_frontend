import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Result from 'antd/es/result';
import List from 'antd/es/list';
import Spin from 'antd/es/spin';
import Collapse from 'antd/es/collapse';
import { useMediaQuery } from 'usehooks-ts';
import { nftsActions } from '../../../redux/actions';
import { blockchainSelectors, nftsSelectors } from '../../../redux/selectors';
import ItemNft from '../ItemNft';

function OnSale() {
  const dispatch = useDispatch();
  const userWalletAddress = useSelector(
    blockchainSelectors.userWalletAddressSelector,
  );
  const nftsOnSale = useSelector(nftsSelectors.nftsOnSale);
  const isBiggerThanMediumScreen = useMediaQuery('(min-width: 1200px)');

  useEffect(() => {
    dispatch(nftsActions.getNftsOnSale.call(userWalletAddress));
  }, [dispatch, userWalletAddress]);

  if (!nftsOnSale) {
    return <Spin />;
  }

  return (
    <Collapse
      collapsible="icon"
      defaultActiveKey={['sale']}
      items={[{
        key: 'sale',
        label: 'On sale',
        children: nftsOnSale.length ? (
          <List
            dataSource={nftsOnSale}
            grid={isBiggerThanMediumScreen ? {
              gutter: 16,
            } : undefined}
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
        ) : <Result status={404} title="There are no NFTs on sale" />,
      }]}
    />
  );
}

export default OnSale;

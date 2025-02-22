import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Result from 'antd/es/result';
import List from 'antd/es/list';
import Spin from 'antd/es/spin';
import Collapse from 'antd/es/collapse';
import { useMediaQuery } from 'usehooks-ts';
import { nftsActions } from '../../../redux/actions';
import { blockchainSelectors, nftsSelectors } from '../../../redux/selectors';
import CreateEditNFTModalWrapper from '../../Modals/Nfts/CreateEditNft';
import ItemNft from '../ItemNft';

function NftsComponent() {
  const dispatch = useDispatch();
  const nftsAll = useSelector(nftsSelectors.nfts);
  const walletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);
  const isBiggerThanMediumScreen = useMediaQuery('(min-width: 1200px)');

  useEffect(() => {
    dispatch(nftsActions.getAllNfts.call(walletAddress));
  }, [dispatch, walletAddress]);
  const { nfts } = nftsAll || {};

  if (!nfts) {
    return <Spin />;
  }

  return (
    <Collapse
      collapsible="icon"
      defaultActiveKey={['overview']}
      items={[{
        key: 'overview',
        label: 'Overview',
        children: nfts.length ? (
          <List
            dataSource={nfts}
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
              />
            )}
          />
        ) : <Result status={404} title="No NFTs found" />,
        extra: (
          <CreateEditNFTModalWrapper />
        ),
      }]}
    />
  );
}

export default NftsComponent;

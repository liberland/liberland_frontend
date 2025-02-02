import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Alert from 'antd/es/alert';
import List from 'antd/es/list';
import Spin from 'antd/es/spin';
import Flex from 'antd/es/flex';
import { nftsActions } from '../../../redux/actions';
import { blockchainSelectors, nftsSelectors } from '../../../redux/selectors';
import CreateEditNFTModalWrapper from '../../Modals/Nfts/CreateEditNft';
import ItemNft from '../ItemNft';

function NftsComponent() {
  const dispatch = useDispatch();
  const nftsAll = useSelector(nftsSelectors.nfts);
  const walletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);

  useEffect(() => {
    dispatch(nftsActions.getAllNfts.call(walletAddress));
  }, [dispatch, walletAddress]);
  const { nfts } = nftsAll;

  if (!nfts) {
    return <Spin />;
  }

  return (
    <Flex vertical gap="20px">
      <Flex justify="end">
        <CreateEditNFTModalWrapper />
      </Flex>
      {nfts.length ? (
        <List
          dataSource={nfts}
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
            />
          )}
        />
      ) : <Alert type="info" message="No NFTs found" />}
    </Flex>
  );
}

export default NftsComponent;

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Alert from 'antd/es/alert';
import List from 'antd/es/list';
import Spin from 'antd/es/spin';
import Flex from 'antd/es/flex';
import { useHistory } from 'react-router-dom';
import routes from '../../../router';
import Button from '../../Button/Button';
import FillNumberWrapper from '../../Modals/FillNumber';
import { nftsActions } from '../../../redux/actions';
import { blockchainSelectors, nftsSelectors } from '../../../redux/selectors';
import ItemNft from '../ItemNft';

function OwnedNfts() {
  const dispatch = useDispatch();
  const history = useHistory();

  const userCollections = useSelector(nftsSelectors.userCollections);
  const userWalletAddress = useSelector(
    blockchainSelectors.userWalletAddressSelector,
  );
  const nfts = useSelector(nftsSelectors.userNftsSelector);

  useEffect(() => {
    dispatch(nftsActions.getNfts.call(userWalletAddress));
  }, [dispatch, userWalletAddress]);

  useEffect(() => {
    dispatch(nftsActions.getUserCollections.call(userWalletAddress));
  }, [dispatch, userWalletAddress]);
  const nftIds = nfts.map((nft) => Number(nft.nftId));
  const nftsId = nftIds.length > 0 ? Math.max(...nftIds) : 0;

  if (!nfts) {
    return <Spin />;
  }

  return (
    <Flex vertical gap="20px">
      <Flex wrap gap="15px" justify="end">
        <Button
          primary
          onClick={() => history.push(routes.nfts.overview)}
        >
          Buy and Browse
        </Button>
        <FillNumberWrapper
          itemList={userCollections}
          textData={{
            title: 'NFT id',
            description: '',
            amount: nftsId + 1 || 0,
            submitButtonText: 'Mint',
          }}
          higherThanZero={false}
          onAccept={(collectionId, itemId) => {
            dispatch(
              nftsActions.mintNft.call({
                collectionId,
                itemId,
                mintTo: userWalletAddress,
              }),
            );
          }}
        />
      </Flex>
      {nfts.length ? (
        <List
          dataSource={nfts}
          grid={{
            gutter: 16,
          }}
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
              isOwnItem
            />
          )}
        />
      ) : <Alert message="You have no NFTs" type="info" />}
    </Flex>
  );
}

export default OwnedNfts;

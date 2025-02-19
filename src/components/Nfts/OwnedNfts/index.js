import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Result from 'antd/es/result';
import List from 'antd/es/list';
import Spin from 'antd/es/spin';
import Flex from 'antd/es/flex';
import Collapse from 'antd/es/collapse';
import { useMediaQuery } from 'usehooks-ts';
import { useHistory } from 'react-router-dom';
import routes from '../../../router';
import Button from '../../Button/Button';
import { nftsActions } from '../../../redux/actions';
import { blockchainSelectors, nftsSelectors } from '../../../redux/selectors';
import ItemNft from '../ItemNft';
import FillNumberModal from '../../Modals/FillNumber';

function OwnedNfts() {
  const dispatch = useDispatch();
  const history = useHistory();
  const isBiggerThanMediumScreen = useMediaQuery('(min-width: 1200px)');
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
    <Collapse
      collapsible="icon"
      defaultActiveKey={['owned']}
      items={[{
        key: 'owned',
        label: 'Owned NFTs',
        extra: (
          <Flex wrap gap="15px">
            <Button
              primary
              onClick={() => history.push(routes.nfts.overview)}
            >
              Buy and Browse
            </Button>
            <FillNumberModal
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
        ),
        children: nfts.length ? (
          <List
            className="centeredList"
            dataSource={nfts}
            grid={isBiggerThanMediumScreen ? {
              gutter: 16,
            } : undefined}
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
        ) : <Result title="You have no NFTs" status={404} />,
      }]}
    />
  );
}

export default OwnedNfts;

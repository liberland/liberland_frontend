import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import routes from '../../../router';
import Button from '../../Button/Button';
import stylesPage from '../../../utils/pagesBase.module.scss';
import Card from '../../Card';
import styles from './styles.module.scss';
import stylesNft from '../Overview/styles.module.scss';
import FillNumberWrapper from '../../Modals/FillNumber';
import { nftsActions } from '../../../redux/actions';
import { blockchainSelectors, nftsSelectors } from '../../../redux/selectors';
import ItemNft from '../ItemNft';

function OwnedNfts() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  return (
    <>
      <div className={stylesPage.contentWrapper}>
        <div className={stylesPage.sectionWrapper}>
          <Card className={stylesPage.overviewWrapper}>
            <div className={styles.topInfo}>
              <span className={stylesPage.cardTitle}>Your Nfts</span>
              <Button primary small onClick={() => setIsModalOpen(true)}>
                MINT NFT
              </Button>
            </div>
            {!nfts || nfts.length < 1 ? (
              <div className={styles.noNfts}>
                <span>You dont have any NFTs</span>
                <Button
                  primary
                  small
                  onClick={() => history.push(routes.nfts.overview)}
                >
                  buy some or browse NFTs
                </Button>
              </div>
            ) : (
              <div className={stylesPage.overViewCard}>
                <div className={stylesNft.nfts}>
                  {nfts.map((nft) => {
                    const {
                      collectionId,
                      nftId,
                      collectionMetadata,
                      itemMetadata,
                    } = nft;
                    return (
                      <ItemNft
                        key={collectionId + nftId}
                        itemMetadata={itemMetadata}
                        collectionId={collectionId}
                        nftId={nftId}
                        collectionMetadata={collectionMetadata}
                        isOwnItem
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
      {isModalOpen && (
        <FillNumberWrapper
          itemList={userCollections}
          closeModal={() => setIsModalOpen(false)}
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
            setIsModalOpen(false);
          }}
        />
      )}
    </>
  );
}

export default OwnedNfts;

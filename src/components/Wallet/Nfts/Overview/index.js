import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { nftsActions } from '../../../../redux/actions';
import { nftsSelectors } from '../../../../redux/selectors';
import styles from './styles.module.scss';
import Card from '../../../Card';
import stylesPage from '../../../../utils/pagesBase.module.scss';
import CreateEditNFTModalWrapper from '../../../Modals/Nfts/CreateEditNft';
import ItemNft from '../ItemNft';

function NftsComponent() {
  const dispatch = useDispatch();
  const nfts = useSelector(nftsSelectors.nfts);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(nftsActions.getAllNfts.call());
  }, [dispatch]);

  return (
    <>
      <div className={stylesPage.contentWrapper}>
        <div className={stylesPage.sectionWrapper}>
          <Card className={stylesPage.overviewWrapper}>
            <div className={styles.topInfo}>
              <span className={stylesPage.cardTitle}>Nfts</span>
            </div>
            {!nfts || nfts.length < 1 ? (
              <div>No any NFTs minted</div>
            ) : (
              <div className={stylesPage.overViewCard}>
                <div className={styles.nfts}>
                  {nfts.map((nft) => {
                    const {
                      collectionId,
                      nftId,
                      collectionMetadata,
                      itemMetadata,
                    } = nft;
                    if (!nftId) {
                      return null;
                    }
                    return (
                      <ItemNft
                        key={collectionId + nftId}
                        itemMetadata={itemMetadata}
                        collectionId={collectionId}
                        nftId={nftId}
                        collectionMetadata={collectionMetadata}
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
        <CreateEditNFTModalWrapper closeModal={() => setIsModalOpen(false)} />
      )}
    </>
  );
}

export default NftsComponent;

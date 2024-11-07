import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import stylesPage from '../../../../utils/pagesBase.module.scss';
import Card from '../../../Card';
import styles from '../Overview/styles.module.scss';
import { nftsActions } from '../../../../redux/actions';
import {
  blockchainSelectors,
  nftsSelectors,
} from '../../../../redux/selectors';
import ItemNft from '../ItemNft';

function OnSale() {
  const dispatch = useDispatch();
  const userWalletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);
  const nftsOnSale = useSelector(nftsSelectors.nftsOnSale);

  useEffect(() => {
    dispatch(nftsActions.getNftsOnSale.call());
  }, [dispatch, userWalletAddress]);

  return (
    <div className={stylesPage.contentWrapper}>
      <div className={stylesPage.sectionWrapper}>
        <Card className={stylesPage.overviewWrapper}>
          <div className={styles.topInfo}>
            <span className={stylesPage.cardTitle}>Nfts On Sale</span>
          </div>
          {!nftsOnSale || nftsOnSale.length < 1 ? (
            <div>There is no any nft on sale</div>
          ) : (
            <div className={stylesPage.overViewCard}>
              <div className={styles.nfts}>
                {nftsOnSale.map((nft) => {
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
                      isOnSaleItem
                    />
                  );
                })}
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export default OnSale;

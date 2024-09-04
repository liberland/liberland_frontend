import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { nftsActions } from '../../../redux/actions';
import { blockchainSelectors, nftsSelectors } from '../../../redux/selectors';
import styles from './styles.module.scss';
import Card from '../../Card';
import stylesPage from '../../../utils/pagesBase.module.scss';

function NftsComponent() {
  const dispatch = useDispatch();
  const walletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);
  const nfts = useSelector(nftsSelectors.userNftsSelector);

  useEffect(() => {
    dispatch(nftsActions.getNfts.call(walletAddress));
  }, [dispatch, walletAddress]);

  if (!nfts) {
    return (
      <div>
        No any nfts...
      </div>
    );
  }

  return (
    <div className={stylesPage.contentWrapper}>
      <div className={stylesPage.sectionWrapper}>
        <Card className={stylesPage.overviewWrapper} title="Nfts">
          <div className={stylesPage.overViewCard}>
            <div className={styles.nfts}>
              {nfts.map((nft) => {
                const {
                  collectionId, nftId, collectionMetadata, itemMetadata,
                } = nft;
                return (
                  <div key={collectionId + nftId}>
                    <p>
                      Collection Id:
                      {' '}
                      {collectionId}
                    </p>
                    <p>
                      Name:
                      {' '}
                      {collectionMetadata.data}
                    </p>
                    <p>
                      Nft Id:
                      {' '}
                      {nftId}
                    </p>
                    <br />
                    <img src={itemMetadata.data} alt={collectionMetadata.data} />
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default NftsComponent;

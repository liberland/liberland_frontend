import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { nftsActions } from '../../../redux/actions';
import { blockchainSelectors, nftsSelectors } from '../../../redux/selectors';
import styles from '../Overview/styles.module.scss';
import Card from '../../Card';
import stylesPage from '../../../utils/pagesBase.module.scss';
import Button from '../../Button/Button';
import CreateEditCollectionModalWrapper from '../../Modals/Nfts/CreateEditCollection';

function Collections() {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const userCollections = useSelector(nftsSelectors.userCollections);
  const userWalletAddress = useSelector(
    blockchainSelectors.userWalletAddressSelector,
  );

  useEffect(() => {
    dispatch(nftsActions.getUserCollections.call(userWalletAddress));
  }, [dispatch, userWalletAddress]);

  return (
    <div className={stylesPage.contentWrapper}>
      <div className={stylesPage.sectionWrapper}>
        <Card className={stylesPage.overviewWrapper}>
          <div className={styles.topInfo}>
            <span className={stylesPage.cardTitle}>Collections</span>
            <Button primary small onClick={() => setIsModalOpen(true)}>
              CREATE COLLECTION
            </Button>
          </div>
          <div>
            {userCollections && userCollections.length > 0 ? (
              userCollections.map((item) => (
                <div key={item.collectionId}>
                  Collection ID:
                  {item.collectionId}
                </div>
              ))
            ) : (
              <div>You don&apos;t have any collection</div>
            )}
          </div>
        </Card>
      </div>

      {isModalOpen && (
        <CreateEditCollectionModalWrapper
          closeModal={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}

export default Collections;

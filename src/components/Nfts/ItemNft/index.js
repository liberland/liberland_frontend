import React from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Card from 'antd/es/card';
import Dropdown from 'antd/es/dropdown';
import { useHistory, useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import { nftsActions } from '../../../redux/actions';
import FillAddressWrapper from '../../Modals/FillAddress';
import Button from '../../Button/Button';
import styles from './styles.module.scss';
import SetAttributeModalWrapper from '../../Modals/Nfts/SetAttribute';
import FullImageModal from '../../Modals/Nfts/FullImage';
import { ReactComponent as OpenNewTabIcon } from '../../../assets/icons/openNewTab.svg';
import { ReactComponent as MenuIcon } from '../../../assets/icons/menu.svg';

import { formatDollars, parseDollars } from '../../../utils/walletHelpers';
import router from '../../../router';
import FillNumberModal from '../../Modals/FillNumber';

function ItemNft({
  itemMetadata,
  collectionId,
  nftId,
  collectionMetadata,
  isOwnItem,
  isOnSaleItem,
}) {
  const location = useLocation();
  const dispatch = useDispatch();
  const history = useHistory();
  const {
    image, name, description, itemPrice,
  } = itemMetadata;

  const onBurn = () => {
    dispatch(
      nftsActions.destroyNft.call({ collectionId, itemId: Number(nftId) }),
    );
  };

  const onBuyNft = () => {
    dispatch(
      nftsActions.bidNft.call({
        collectionId,
        itemId: nftId,
        bidPrice: itemPrice,
      }),
    );
  };

  const textData = {
    nft: {
      ...itemMetadata,
      nftId,
    },
    collection: {
      ...collectionMetadata,
      collectionId,
    },
  };

  return (
    <Card
      title={collectionMetadata?.data || name || nftId}
      className={styles.card}
      actions={[
        isOnSaleItem && itemPrice && (
          <Button
            onClick={onBuyNft}
            primary
            className={styles.button}
          >
            Buy for
            {' '}
            {formatDollars(itemPrice)}
            {' '}
            LLD
          </Button>
        ),
      ].filter(Boolean)}
      cover={(
        <div
          className={styles.imageWrapper}
        >
          <div
            className={cx(styles.showImage, styles.price)}
            onClick={() => {
              if (location.pathname !== router.nfts.shop && itemPrice) {
                history.push(router.nfts.shop);
              }
            }}
          >
            {itemPrice ? `${formatDollars(itemPrice)} LLD` : 'Not for sale'}
          </div>
          {isOwnItem && (
            <Dropdown
              trigger={['click']}
              menu={{
                items: [
                  (
                    <FillAddressWrapper
                      textData={textData}
                      onAccept={(address) => {
                        dispatch(
                          nftsActions.transferNft.call({
                            collectionId,
                            itemId: Number(nftId),
                            newOwner: address,
                          }),
                        );
                      }}
                    />
                  ),
                  (
                    <FillNumberModal
                      textData={{ ...textData, submitButtonText: 'Set Price' }}
                      onAccept={(amount) => {
                        dispatch(
                          nftsActions.sellNft.call({
                            collectionId,
                            itemId: Number(nftId),
                            price: parseDollars(amount),
                          }),
                        );
                      }}
                    />
                  ),
                  (
                    <SetAttributeModalWrapper
                      collectionId={collectionId}
                      itemId={nftId}
                    />
                  ),
                  (
                    <Button onClick={onBurn} red className={styles.button}>
                      Burn
                    </Button>
                  ),
                ].map((label, index) => ({
                  label,
                  index,
                })),
              }}
            >
              <div className={cx(styles.showImage, styles.menu)}>
                <MenuIcon className={styles.icon} />
              </div>
            </Dropdown>
          )}
          {image && (
            <>
              <FullImageModal image={image} />
              <a href={image} target="blank" className={cx(styles.showImage, styles.openNewTab)}>
                <OpenNewTabIcon className={styles.icon} />
              </a>
            </>
          )}
          {image ? (
            <img src={image} alt={name} className={styles.image} />
          ) : (
            <div className={styles.image} />
          )}
        </div>
      )}
    >
      <Card.Meta
        description={(
          <>
            <p>
              <b>Collection Id:</b>
              {' '}
              {collectionId}
            </p>
            <p>
              <b>Nft Id:</b>
              {' '}
              {nftId}
            </p>
            <p>
              <b>Description:</b>
              {' '}
              {description}
            </p>
          </>
        )}
      />
    </Card>
  );
}

ItemNft.defaultProps = {
  itemMetadata: {},
  collectionMetadata: {},
  isOnSaleItem: false,
  isOwnItem: false,
};

ItemNft.propTypes = {
  itemMetadata: PropTypes.shape({
    image: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    itemPrice: PropTypes.string,
  }),
  collectionId: PropTypes.string.isRequired,
  nftId: PropTypes.string.isRequired,
  collectionMetadata: PropTypes.shape({
    data: PropTypes.string,
  }),
  isOwnItem: PropTypes.bool,
  isOnSaleItem: PropTypes.bool,
};

export default ItemNft;

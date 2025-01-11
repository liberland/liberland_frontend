import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Card from 'antd/es/card';
import Dropdown from 'antd/es/dropdown';
import { useHistory, useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import { nftsActions } from '../../../redux/actions';
import FillAddressWrapper from '../../Modals/FillAddress';
import FillNumberWrapper from '../../Modals/FillNumber';
import Button from '../../Button/Button';
import styles from './styles.module.scss';
import CreateEditNFTModalWrapper from '../../Modals/Nfts/CreateEditNft';
import SetAttributeModalWrapper from '../../Modals/Nfts/SetAttribute';
import { ReactComponent as FullScreenIcon } from '../../../assets/icons/fullScreen.svg';
import { ReactComponent as OpenNewTabIcon } from '../../../assets/icons/openNewTab.svg';
import { ReactComponent as MenuIcon } from '../../../assets/icons/menu.svg';

import FullImageWrapper from '../../Modals/Nfts/FullImage';
import { formatDollars, parseDollars } from '../../../utils/walletHelpers';
import router from '../../../router';

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

  const [isImageOpen, setIsImageOpen] = useState(false);

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
                  {
                    key: 'address',
                    children: (
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
                  },
                  {
                    key: 'price',
                    children: (
                      <FillNumberWrapper
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
                  },
                  {
                    key: 'create',
                    children: (
                      <CreateEditNFTModalWrapper
                        collectionId={collectionId}
                        nftId={nftId}
                      />
                    ),
                  },
                  {
                    key: 'attribute',
                    children: (
                      <SetAttributeModalWrapper
                        collectionId={collectionId}
                        itemId={nftId}
                      />
                    ),
                  },
                  {
                    key: 'burn',
                    children: (
                      <Button onClick={onBurn} red className={styles.button}>
                        Burn
                      </Button>
                    ),
                  },
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
              <div className={styles.showImage} onClick={() => setIsImageOpen(true)}>
                <FullScreenIcon className={styles.icon} />
              </div>
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
      {isImageOpen && (
        <FullImageWrapper closeModal={() => setIsImageOpen(false)} image={image} />
      )}
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

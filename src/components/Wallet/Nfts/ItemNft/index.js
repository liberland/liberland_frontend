import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { nftsActions } from '../../../../redux/actions';
import FillAddressWrapper from '../../../Modals/FillAddress';
import FillNumberWrapper from '../../../Modals/FillNumber';
import Button from '../../../Button/Button';
import styles from '../Overview/styles.module.scss';
import CreateEditNFTModalWrapper from '../../../Modals/Nfts/CreateEditNft';
import SetAttributeModalWrapper from '../../../Modals/Nfts/SetAttribiute';

function ItemNft({
  itemMetadata,
  collectionId,
  nftId,
  collectionMetadata,
  isOwnItem,
  isOnSaleItem,
}) {
  const dispatch = useDispatch();
  const {
    image, name, description, itemPrice,
  } = itemMetadata;
  const [isHovered, setIsHovered] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isSetPriceModalOpen, setIsSetPriceModalOpen] = useState(false);
  const [isSetMedatadaOpen, setIsSetMedatadaOpen] = useState(false);
  const [isSetAttribiutesOpen, setIsSetAttribiutesOpen] = useState(false);

  // Handlers for mouse events
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const onBurn = () => {
    dispatch(
      nftsActions.destroyNft.call({ collectionId, itemId: Number(nftId) }),
    );
  };

  const onTransfer = () => {
    setIsTransferModalOpen(true);
  };

  const onSetPrice = () => {
    setIsSetPriceModalOpen(true);
  };

  const onSetAttribiutes = () => {
    setIsSetAttribiutesOpen(true);
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

  if (!name && !isOwnItem) return null;

  return (
    <>
      {isSetAttribiutesOpen && (
        <SetAttributeModalWrapper
          closeModal={() => setIsSetAttribiutesOpen(false)}
          collectionId={collectionId}
          itemId={nftId}
        />
      )}
      {isSetMedatadaOpen && (
        <CreateEditNFTModalWrapper
          collectionId={collectionId}
          nftId={nftId}
          closeModal={() => setIsSetMedatadaOpen(false)}
        />
      )}
      {isTransferModalOpen && (
        <FillAddressWrapper
          textData={textData}
          closeModal={() => setIsTransferModalOpen(false)}
          onAccept={(address) => {
            dispatch(
              nftsActions.transferNft.call({
                collectionId,
                itemId: Number(nftId),
                newOwner: address,
              }),
            );
            setIsTransferModalOpen(false);
          }}
        />
      )}
      {isSetPriceModalOpen && (
        <FillNumberWrapper
          closeModal={() => setIsSetPriceModalOpen(false)}
          textData={textData}
          onAccept={(amount) => {
            dispatch(
              nftsActions.sellNft.call({
                collectionId,
                itemId: Number(nftId),
                price: Number(amount),
              }),
            );
            setIsSetPriceModalOpen(false);
          }}
        />
      )}

      <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <p>
          <b>Collection Id:</b>
          {' '}
          {collectionId}
        </p>
        {collectionMetadata?.data && (
          <p>
            <b>Name:</b>
            {' '}
            {collectionMetadata?.data}
          </p>
        )}
        <p>
          <b>Nft Id:</b>
          {' '}
          {nftId}
        </p>
        <p>
          <b>Name:</b>
          {' '}
          {name}
        </p>
        <p>
          <b>Description:</b>
          {' '}
          {description}
        </p>

        <br />
        <div className={styles.imageWrapper}>
          {image ? (
            <img src={image} alt={name} className={styles.image} />
          ) : (
            <div className={styles.image} />
          )}
          {isHovered && name && isOwnItem && (
            <div className={styles.buttonContainer}>
              <Button
                small
                onClick={onTransfer}
                primary
                className={styles.button}
              >
                Transfer
              </Button>
              <Button
                small
                onClick={onSetPrice}
                primary
                className={styles.button}
              >
                Set Price
              </Button>
              <Button
                small
                onClick={() => setIsSetMedatadaOpen(true)}
                primary
                className={styles.button}
              >
                Set Metadata
              </Button>
              <Button
                small
                onClick={onSetAttribiutes}
                primary
                className={styles.button}
              >
                Set Attribute
              </Button>
              <Button small onClick={onBurn} red className={styles.button}>
                Burn
              </Button>
            </div>
          )}
          {isHovered && isOnSaleItem && (
            <div className={styles.buttonContainer}>
              <Button
                small
                onClick={onBuyNft}
                primary
                className={styles.button}
              >
                Buy for
                {' '}
                {itemPrice}
              </Button>
            </div>
          )}
          {!name && isOwnItem && (
            <div className={styles.buttonContainer}>
              <Button
                small
                onClick={() => setIsSetMedatadaOpen(true)}
                primary
                className={styles.button}
              >
                Set Metadata
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
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

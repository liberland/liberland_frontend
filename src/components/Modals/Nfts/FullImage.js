import React from 'react';
import PropTypes from 'prop-types';
import modalWrapper from '../components/ModalWrapper';
import { ReactComponent as FullScreenIcon } from '../../../assets/icons/fullScreen.svg';
import styles from './styles.module.scss';
import stylesNft from '../../Nfts/ItemNft/styles.module.scss';
import { ReactComponent as Close } from '../../../assets/icons/close.svg';

function FullImage({ image, onClose }) {
  return (
    <div>
      <div className={styles.close} onClick={onClose}><Close className={styles.icon} /></div>
      <div className={styles.imageWrapper}>
        <img className={styles.image} src={image} alt="nft" />
      </div>
    </div>
  );
}

FullImage.propTypes = {
  image: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

function ButtonModal(props) {
  const { onClick } = props;
  return (
    <div className={stylesNft.showImage} onClick={onClick}>
      <FullScreenIcon className={stylesNft.icon} />
    </div>
  );
}

ButtonModal.propTypes = {
  onClick: PropTypes.func.isRequired,
};

const FullImageModal = modalWrapper(FullImage, ButtonModal);

export default FullImageModal;

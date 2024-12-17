import React from 'react';
import PropTypes from 'prop-types';
import ModalRoot from '../ModalRoot';
import styles from './styles.module.scss';
import { ReactComponent as CloseIcon } from '../../../assets/icons/close.svg';

function FullImageModal({ closeModal, image }) {
  return (
    <div className={styles.imageWrapper}>
      <div className={styles.iconWrapper}><CloseIcon className={styles.icon} onClick={closeModal} /></div>
      <img className={styles.image} src={image} alt="nft" />
    </div>
  );
}

FullImageModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  image: PropTypes.string.isRequired,
};

function FullImageWrapper(props) {
  return (
    <ModalRoot>
      <FullImageModal {...props} />
    </ModalRoot>
  );
}

export default FullImageWrapper;

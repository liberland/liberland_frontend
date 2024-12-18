import React from 'react';
import PropTypes from 'prop-types';
import ModalRoot from '../ModalRoot';
import styles from './styles.module.scss';

function FullImageModal({ image }) {
  return (
    <div className={styles.imageWrapper}>
      <img className={styles.image} src={image} alt="nft" />
    </div>
  );
}

FullImageModal.propTypes = {
  image: PropTypes.string.isRequired,
};

function FullImageWrapper({
  closeModal,
  image,
}) {
  return (
    <ModalRoot onClose={closeModal}>
      <FullImageModal image={image} />
    </ModalRoot>
  );
}

export default FullImageWrapper;

FullImageWrapper.propTypes = {
  closeModal: PropTypes.func.isRequired,
  image: PropTypes.string.isRequired,
};

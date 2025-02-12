import React from 'react';
import MenuOutlined from '@ant-design/icons/MenuOutlined';
import PropTypes from 'prop-types';
import styles from '../styles.module.scss';
import UrlMenu from '../UrlMenu';
import modalWrapper from '../../Modals/components/ModalWrapper';

function Button(props) {
  const { onClick } = props;
  return (
    <MenuOutlined
      className={styles.menuIcon}
      onClick={onClick}
      aria-label="Open pagination menu"
    />
  );
}

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
};

const ModalMenu = modalWrapper(
  UrlMenu,
  Button,
  { className: styles.mobileMenuOpen, classNames: { content: styles.mobileMenuOpenContent }, closable: true },
);

export default ModalMenu;

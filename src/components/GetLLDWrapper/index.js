import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { blockchainSelectors } from '../../redux/selectors';
import Button from '../Button/Button';
import styles from './styles.module.scss';

const link = 'https://docs.liberland.org/blockchain/ecosystem/how-to-acquire-lld';

export default function GetLLDWrapper({ children }) {
  const walletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);
  if (walletAddress) {
    return children || null;
  }
  return (
    <div>
      <Button href={link} primary className={styles.lldWrapper}>
        Get LLD
      </Button>
    </div>
  );
}

GetLLDWrapper.propTypes = {
  children: PropTypes.node,
};

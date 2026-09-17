import React from 'react';
import PropTypes from 'prop-types';
import QRCode from 'antd/es/qr-code';
import Flex from 'antd/es/flex';
import notification from 'antd/es/notification';
import Button from '../Button/Button';
import { getSelectedNetwork, NETWORKS } from '../../utils/networkHelpers';
import styles from './styles.module.scss';

// Senders are told to check the leading and trailing characters of an address
// after scanning or pasting, which is the practical defence against clipboard
// hijacking and a swapped QR. Six each end is the common convention.
const VERIFY_CHARS = 6;

/**
 * The plain "here is my address" block.
 *
 * A receive screen has to show the address itself — as text, in full, and
 * copyable — not only encode it inside a QR or a payment link. Everything else
 * on the screen is a convenience wrapped around this one string.
 *
 * The QR carries the bare address, because that is what every wallet can
 * scan. Payment links are useful but wallet-specific; a raw address is not.
 */
function ReceiveAddress({ address, title }) {
  const [api, contextHolder] = notification.useNotification();
  const network = NETWORKS[getSelectedNetwork()];

  if (!address) return null;

  const head = address.slice(0, VERIFY_CHARS);
  const tail = address.slice(-VERIFY_CHARS);
  const middle = address.slice(VERIFY_CHARS, -VERIFY_CHARS);

  const copy = () => {
    navigator.clipboard.writeText(address);
    api.success({ message: 'Address copied' });
  };

  return (
    <div className={styles.wrapper} data-testid="receive-address">
      {contextHolder}
      <Flex justify="space-between" align="center" wrap gap="8px">
        <span className={styles.title}>{title}</span>
        <span className={styles.network} data-testid="receive-address-network">
          {network.label}
        </span>
      </Flex>

      <Flex gap="18px" wrap align="flex-start" className={styles.body}>
        {/* Forced light-on-dark-free palette: a QR inverted by the dark theme
            scans unreliably, so the code keeps its own light background. */}
        <div className={styles.qrBox}>
          <QRCode
            value={address}
            size={148}
            bordered={false}
            color="#000000"
            bgColor="#FFFFFF"
            errorLevel="M"
          />
        </div>

        <Flex vertical gap="10px" className={styles.details}>
          <div>
            <div className={styles.label}>Your address</div>
            <code className={styles.address} data-testid="receive-address-value">
              <span className={styles.verify}>{head}</span>
              {middle}
              <span className={styles.verify}>{tail}</span>
            </code>
          </div>
          <Flex gap="10px" wrap>
            <Button primary small onClick={copy} data-testid="receive-address-copy">
              Copy address
            </Button>
          </Flex>
          <div className={styles.hint}>
            {`Scan the code or copy the address to receive ${network.label} funds. After
            scanning, check the highlighted first and last ${VERIFY_CHARS} characters
            match — that is what catches a swapped or tampered address.`}
          </div>
        </Flex>
      </Flex>
    </div>
  );
}

ReceiveAddress.propTypes = {
  address: PropTypes.string,
  title: PropTypes.string,
};

ReceiveAddress.defaultProps = {
  title: 'Receive',
};

export default ReceiveAddress;

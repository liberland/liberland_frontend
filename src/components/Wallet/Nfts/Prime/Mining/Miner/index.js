import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Table from 'antd/es/table';
import Alert from 'antd/es/alert';
import { useSelector } from 'react-redux';
import { ethSelectors } from '../../../../../../redux/selectors';
import Button from '../../../../../Button/Button';
import { mintNft } from '../../../../../../api/ethereum';
import styles from '../../styles.module.scss';
import { createGradient, webWorkerPrimeFinder } from '../utils';

function Miner({ processes, account, isActive }) {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState(false);
  useEffect(() => isActive && webWorkerPrimeFinder(processes, setData), [isActive, processes]);
  const connected = useSelector(ethSelectors.selectorConnected);

  const onMintFactory = ({ n, d, s }) => async () => {
    try {
      setLoading(true);
      setError(false);
      setSuccess(false);
      const signer = await connected.provider.getSigner(account);
      await mintNft({
        account: signer,
        number: n,
        d,
        s,
      });
      setSuccess(true);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && (
        <Alert type="error" message="Minting process failed" />
      )}
      {success && (
        <Alert type="success" message="Mint successful!" />
      )}
      {isActive && (
        <Alert type="info" message="Mining NFT Prime..." />
      )}
      <Table
        dataSource={data}
        loading={!data.length && isActive}
        locale={{
          emptyText: () => (isActive ? 'Minting...' : 'Click on minting switch to start!'),
        }}
        columns={[
          {
            key: 'number',
            dataIndex: 'n',
            label: 'NFT image',
            render: (value) => (
              <div style={createGradient(value)} className={styles.gradient} />
            ),
          },
          {
            key: 'mint',
            dataIndex: '',
            label: 'Mint',
            render: (_, toMint) => (
              <Button onClick={onMintFactory(toMint)}>
                {loading ? 'Loading...' : 'Mint NFT Prime!'}
              </Button>
            ),
          },
        ]}
      />
    </>
  );
}

Miner.propTypes = {
  processes: PropTypes.number.isRequired,
  account: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
};

export default Miner;

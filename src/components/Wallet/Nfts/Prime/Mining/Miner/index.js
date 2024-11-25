import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Table from 'antd/es/table';
import Alert from 'antd/es/alert';
import { useDispatch, useSelector } from 'react-redux';
import { ethSelectors } from '../../../../../../redux/selectors';
import { nftsActions } from '../../../../../../redux/actions';
import Button from '../../../../../Button/Button';
import { mintNft } from '../../../../../../api/ethereum';
import styles from '../../styles.module.scss';
import { webWorkerPrimeFinder } from '../utils';
import Gradient from '../../Gradient';

function Miner({ processes, account, isActive }) {
  const dispatch = useDispatch();
  const [mined, setMined] = React.useState({});
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
      dispatch(nftsActions.getNftPrimesCount.call());
      dispatch(nftsActions.getOwnNftPrimeCount.call({ account }));
      setMined((prevMined) => ({ ...prevMined, [n.toString()]: true }));
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
        <Alert type="error" className={styles.formAlert} message="Minting process failed" />
      )}
      {success && (
        <Alert type="success" className={styles.formAlert} message="Mint successful!" />
      )}
      {isActive && (
        <Alert type="info" className={styles.formAlert} message="Mining NFT Prime..." />
      )}
      <Table
        dataSource={data}
        loading={!data.length && isActive}
        locale={{
          emptyText: () => (isActive ? 'Minting...' : 'Click on minting switch to start!'),
        }}
        rowKey="n"
        columns={[
          {
            key: 'number',
            dataIndex: 'n',
            label: 'NFT image',
            render: (value) => (
              <Gradient val={value} />
            ),
          },
          {
            key: 'mint',
            dataIndex: 'd',
            label: 'Mint',
            render: (_, toMint) => {
              const isMined = mined[toMint.n.toString()];
              if (isMined) {
                return (
                  <Button disabled>Already mined</Button>
                );
              }
              return (
                <Button onClick={onMintFactory(toMint)}>
                  {loading ? 'Loading...' : 'Mint NFT Prime!'}
                </Button>
              );
            },
          },
        ]}
        pagination={{ pageSize: 5 }}
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

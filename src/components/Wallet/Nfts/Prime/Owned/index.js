import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import Table from 'antd/es/table';
import { nftsSelectors } from '../../../../../redux/selectors';
import { nftsActions } from '../../../../../redux/actions';
import { createGradient, downloadImage } from '../Mining/utils';
import Button from '../../../../Button/Button';
import styles from '../styles.module.scss';

function Owned({ address }) {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const owned = useSelector(nftsSelectors.ownNftPrimesSelector);
  const loading = useSelector(nftsSelectors.ownNftPrimesLoadingSelector);
  const imageRefs = React.useRef({});

  useEffect(() => {
    dispatch(nftsActions.getOwnNftPrimeCount.call({
      from: 0,
      to: 5,
      address,
    }));
    setPage(1);
  }, [dispatch, address]);

  return (
    <Table
      dataSource={owned}
      loading={loading}
      columns={[
        {
          dataIndex: 'id',
          key: 'id',
          title: 'Id',
        },
        {
          dataIndex: 'val',
          key: 'val',
          title: 'NFT',
          render: (val, { id }) => (
            <div
              style={createGradient(val)}
              className={styles.gradient}
              ref={(div) => {
                imageRefs.current[id] = div;
              }}
            />
          ),
        },
        {
          dataIndex: 'bitlen',
          key: 'bitlen',
          title: 'Size in bytes',
          render: (val) => `${parseInt(val) / 8}B`,
        },
        {
          dataIndex: 'id',
          key: 'download',
          title: 'Download image',
          render: (id) => (
            <Button primary onClick={() => downloadImage(id, imageRefs.current[id])}>
              Download
            </Button>
          ),
        },
      ]}
      pagination={{
        pageSize: 5,
        current: page,
        onChange: (currentPage, pageSize) => {
          dispatch(nftsActions.getOwnNftPrimes.call({
            from: (currentPage - 1) * pageSize,
            to: currentPage * pageSize,
            address,
          }));
          setPage(currentPage);
        },
      }}
    />
  );
}

Owned.propTypes = {
  address: PropTypes.string.isRequired,
};

export default Owned;

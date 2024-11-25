import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Table from 'antd/es/table';
import { nftsSelectors } from '../../../../../redux/selectors';
import { nftsActions } from '../../../../../redux/actions';
import { createGradient } from '../Mining/utils';

function All() {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const all = useSelector(nftsSelectors.nftPrimesSelector);
  const count = useSelector(nftsSelectors.nftPrimesCountSelector);
  const loading = useSelector(nftsSelectors.nftPrimesLoadingSelector);

  useEffect(() => {
    dispatch(nftsActions.getNftPrimesCount.call());
  }, [dispatch]);

  useEffect(() => {
    if (count > 0) {
      dispatch(nftsActions.getNftPrimes.call({
        from: 0,
        to: Math.min(count, 5),
      }));
    }
  }, [dispatch, count]);

  return (
    <Table
      dataSource={all || []}
      loading={loading}
      rowKey="val"
      columns={[
        {
          dataIndex: 'val',
          key: 'val',
          title: 'NFT',
          render: (val) => (
            <div
              style={createGradient(val)}
            />
          ),
        },
        {
          dataIndex: 'bitlen',
          key: 'bitlen',
          title: 'Size in bytes',
          render: (val) => `${parseInt(val) / 8}B`,
        },
      ]}
      pagination={{
        pageSize: 5,
        current: page,
        onChange: (currentPage, pageSize) => {
          if (count > 0) {
            dispatch(nftsActions.getNftPrimes.call({
              from: (currentPage - 1) * pageSize,
              to: Math.min(currentPage * pageSize, all.length),
            }));
          }
          setPage(currentPage);
        },
      }}
    />
  );
}

export default All;

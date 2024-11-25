import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Table from 'antd/es/table';
import Spin from 'antd/es/spin';
import { nftsSelectors } from '../../../../../redux/selectors';
import { nftsActions } from '../../../../../redux/actions';
import Gradient from '../Gradient';

function Lookup() {
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
          render: (val) => (val ? <Gradient val={val} /> : <Spin />),
        },
        {
          dataIndex: 'bitlen',
          key: 'bitlen',
          title: 'Size in bytes',
          render: (val) => (val ? `${Math.ceil(parseInt(val) / 8)}B` : <Spin />),
        },
      ]}
      pagination={{
        pageSize: 5,
        current: page,
        total: count,
        onChange: (currentPage, pageSize) => {
          if (count > 0) {
            dispatch(nftsActions.getNftPrimes.call({
              from: (currentPage - 1) * pageSize,
              to: Math.min(currentPage * pageSize, count),
            }));
          }
          setPage(currentPage);
        },
      }}
    />
  );
}

export default Lookup;

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import root from 'react-shadow';
import PropTypes from 'prop-types';
import Table from 'antd/es/table';
import { nftsSelectors } from '../../../../../redux/selectors';
import { nftsActions } from '../../../../../redux/actions';
import { createGradient } from '../Mining/utils';
import ImageDownload from './ImageDownload';

function Owned({ address }) {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const owned = useSelector(nftsSelectors.ownNftPrimesSelector);
  const count = useSelector(nftsSelectors.ownNftPrimesCountSelector)?.[address];
  const loading = useSelector(nftsSelectors.ownNftPrimesLoadingSelector);
  const imageRefs = React.useRef({});

  useEffect(() => {
    dispatch(nftsActions.getOwnNftPrimeCount.call({
      account: address,
    }));
    setPage(1);
  }, [dispatch, address]);

  useEffect(() => {
    if (count > 0) {
      dispatch(nftsActions.getOwnNftPrimes.call({
        account: address,
        from: 0,
        to: Math.min(count, 5),
      }));
    }
  }, [dispatch, address, count]);

  return (
    <Table
      dataSource={owned?.[address] || []}
      loading={loading}
      rowKey="id"
      columns={[
        {
          dataIndex: 'val',
          key: 'val',
          title: 'NFT',
          render: (val, { id }) => (
            <root.div open={false}>
              <div
                style={createGradient(val)}
                ref={(div) => {
                  imageRefs.current[id] = div;
                }}
              />
            </root.div>
          ),
        },
        {
          dataIndex: 'id',
          key: 'id',
          title: 'Id',
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
            <ImageDownload id={id} imageRefs={imageRefs} />
          ),
        },
      ]}
      pagination={{
        pageSize: 5,
        current: page,
        onChange: (currentPage, pageSize) => {
          if (count > 0) {
            dispatch(nftsActions.getOwnNftPrimes.call({
              from: (currentPage - 1) * pageSize,
              to: Math.min(count, currentPage * pageSize),
              account: address,
            }));
          }
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

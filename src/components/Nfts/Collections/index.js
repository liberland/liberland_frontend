import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Spin from 'antd/es/spin';
import Alert from 'antd/es/alert';
import Collapse from 'antd/es/collapse';
import List from 'antd/es/list';
import { nftsActions } from '../../../redux/actions';
import { blockchainSelectors, nftsSelectors } from '../../../redux/selectors';
import CreateEditCollectionModalWrapper from '../../Modals/Nfts/CreateEditCollection';

function Collections() {
  const dispatch = useDispatch();
  const userCollections = useSelector(nftsSelectors.userCollections);
  const userWalletAddress = useSelector(
    blockchainSelectors.userWalletAddressSelector,
  );

  useEffect(() => {
    dispatch(nftsActions.getUserCollections.call(userWalletAddress));
  }, [dispatch, userWalletAddress]);

  if (!userCollections) {
    return <Spin />;
  }

  return (
    <Collapse
      defaultActiveKey={['collections']}
      items={[{
        key: 'collections',
        extra: (
          <CreateEditCollectionModalWrapper />
        ),
        label: 'Collections',
        children: userCollections?.length ? (
          <List
            dataSource={userCollections}
            renderItem={({ collectionId }) => (
              <List.Item>
                <List.Item.Meta title={`Collection ID: ${collectionId}`} />
              </List.Item>
            )}
          />
        ) : <Alert type="info">You don&apos;t have any collection</Alert>,
      }]}
    />
  );
}

export default Collections;

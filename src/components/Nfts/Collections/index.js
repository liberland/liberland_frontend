import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Spin from 'antd/es/spin';
import Result from 'antd/es/result';
import List from 'antd/es/list';
import Collapse from 'antd/es/collapse';
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
      collapsible="icon"
      defaultActiveKey={['collections']}
      items={[{
        key: 'collections',
        label: 'Collections',
        extra: <CreateEditCollectionModalWrapper />,
        children: userCollections?.length ? (
          <List
            dataSource={userCollections}
            renderItem={({ collectionId }) => (
              <List.Item>
                <List.Item.Meta title={`Collection ID: ${collectionId}`} />
              </List.Item>
            )}
          />
        ) : <Result status={404} title={<>You don&apos;t have any collection</>} />,
      }]}
    />
  );
}

export default Collections;

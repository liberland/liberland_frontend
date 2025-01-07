import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Spin from 'antd/es/spin';
import Alert from 'antd/es/alert';
import List from 'antd/es/list';
import Flex from 'antd/es/flex';
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
    <Flex vertical gap="20px">
      <Flex gap="15px" wrap justify="end">
        <CreateEditCollectionModalWrapper />
      </Flex>
      {userCollections?.length ? (
        <List
          grid={{
            gutter: 16,
          }}
          dataSource={userCollections}
          renderItem={({ collectionId }) => (
            <List.Item>
              <List.Item.Meta title={`Collection ID: ${collectionId}`} />
            </List.Item>
          )}
        />
      ) : <Alert type="info" message={<>You don&apos;t have any collection</>} />}
    </Flex>
  );
}

export default Collections;

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMediaQuery } from 'usehooks-ts';
import Row from 'antd/es/row';
import Col from 'antd/es/col';
import Card from 'antd/es/card';
import { nftsActions } from '../../../../redux/actions';
import { blockchainSelectors, nftsSelectors } from '../../../../redux/selectors';

function NftsComponent() {
  const dispatch = useDispatch();
  const walletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);
  const nfts = useSelector(nftsSelectors.userNftsSelector);

  useEffect(() => {
    dispatch(nftsActions.getNfts.call(walletAddress));
  }, [dispatch, walletAddress]);

  const isBiggerThanDesktop = useMediaQuery('(min-width: 1500px)');

  if (!nfts) {
    return (
      <div>
        You dont have any NFTs
      </div>
    );
  }

  return (
    <Row>
      {nfts.map((nft) => {
        const {
          collectionId, nftId, collectionMetadata, itemMetadata,
        } = nft;
        return (
          <Col span={isBiggerThanDesktop ? 8 : 24} key={collectionId + nftId}>
            <Card
              hoverable
              cover={<img src={itemMetadata.data} alt={collectionMetadata.data} />}
            >
              <Card.Meta
                title={collectionMetadata.data}
              />
              <p>
                <b>Collection Id:</b>
                {' '}
                {collectionId}
              </p>
              <p>
                <b>Nft Id:</b>
                {' '}
                {nftId}
              </p>
            </Card>
          </Col>
        );
      })}
    </Row>
  );
}

export default NftsComponent;

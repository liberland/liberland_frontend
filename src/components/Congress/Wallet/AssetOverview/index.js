import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Card from '../../../Card';

import styles from './styles.module.scss';
import { formatAssets } from '../../../../utils/walletHelpers';
import SpendAssetModal from '../../../Modals/SpendAssetModal';
import Button from '../../../Button/Button';

function AssetOverview({
  additionalAssets,
}) {
  const [whichModalOpen, setWhichModalOpen] = useState(null);
  const handleModalOpenAssets = (symbol) => setWhichModalOpen(symbol);
  const handleModalCloseAssets = () => setWhichModalOpen(null);
  if (additionalAssets.length === 0) { return <div />; }
  // Show only assets that the user owns
  const filteredAssets = additionalAssets.filter((asset) => asset?.balance?.balance > 0);
  return (
    <Card className={styles.assetOverviewWrapper} title="Additional assets">
      <div className={styles.assetOverViewCard}>
        {
          filteredAssets.map((assetInfo) => (
            <div
              className={styles.assetCardInfo}
              key={assetInfo.metadata.symbol}
            >
              <p className={styles.assetCardInfoAmount}>
                {assetInfo?.balance ? formatAssets(assetInfo.balance.balance, assetInfo.metadata.decimals) : 0}
              </p>
              <p className={styles.assetCardInfoTitle}>
                {assetInfo.metadata.name}
                {' '}
                <span>
                  (
                  {assetInfo.metadata.symbol}
                  )
                </span>

              </p>
              <Button
                className={styles.button}
                small
                primary
                onClick={() => handleModalOpenAssets(assetInfo.metadata.symbol)}
              >
                <>
                  SPEND
                  <span>
                    {assetInfo.metadata.symbol}
                  </span>
                </>
              </Button>
              {whichModalOpen === assetInfo.metadata.symbol
              && <SpendAssetModal assetData={assetInfo} closeModal={handleModalCloseAssets} />}
            </div>
          ))
        }
      </div>

    </Card>
  );
}
AssetOverview.defaultProps = {
  additionalAssets: [],
};

AssetOverview.propTypes = {
  additionalAssets: PropTypes.arrayOf(PropTypes.shape({
    metadata: {
      symbol: PropTypes.string,
      name: PropTypes.string,
      decimals: PropTypes.number,
    },
    balance: {
      balance: PropTypes.number,
    },
  })),
};

export default AssetOverview;

import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Card from '../../Card';

import styles from './styles.module.scss';
import {formatAssets} from '../../../utils/walletHelpers';
import SendAssetModal from "../../Modals/SendAssetModal";
import Button from "../../Button/Button";

function AssetOverview({
  additionalAssets
}) {
  const [whichModalOpen, setWhichModalOpen] = useState(null);
  const handleModalOpenAssets = (symbol) => {setWhichModalOpen(symbol)}
  const handleModalCloseAssets = () => {setWhichModalOpen(null)}
  if(additionalAssets.length === 0) { return <div />}
  return (
    <Card className={styles.assetOverviewWrapper} title="Additional assets">
      <div className={styles.assetOverViewCard}>
        {
          additionalAssets.map((assetInfo) => (
            <div
              className={styles.assetCardInfo}
              key={assetInfo.metadata.symbol}
            >
              <div className={styles.assetCardInfoAmountWrapper}>
                <p className={styles.assetCardInfoAmount}>
                  {formatAssets(assetInfo.balance.balance, assetInfo.metadata.decimals)}
                  <span>
                    {' '}
                    {assetInfo.metadata.symbol}
                  </span>
                </p>
              </div>
              <p className={styles.assetCardInfoTitle}>{assetInfo.metadata.name}</p>
              <Button small primary onClick={() => {handleModalOpenAssets(assetInfo.metadata.symbol)}}> Send </Button>
              {whichModalOpen === assetInfo.metadata.symbol && <SendAssetModal assetData={assetInfo} closeModal={handleModalCloseAssets} />}
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
  additionalAssets: PropTypes.array,
};

export default AssetOverview;

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { legislationActions } from '../../../redux/actions';
import { blockchainSelectors, legislationSelectors } from '../../../redux/selectors';
import Card from '../../Card';
import { castVetoForLegislation, revertVetoForLegislation } from '../../../api/nodeRpcCall';

import styles from './styles.module.scss';
import Button from '../../Button/Button';

const LegislationView = () => {
  const { tier } = useParams();
  const dispatch = useDispatch();
  const userWalletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);

  useEffect(() => {
    dispatch(legislationActions.getLegislation.call(tier));
  }, [dispatch, tier, legislationActions]);

  const legislation = useSelector(legislationSelectors.legislation);

  if (!legislation[tier]) return 'Loading...';

  console.log(legislation);

  return legislation[tier].map((l) => (
    <Card className={styles.legislationCard} title={`#${l.index}`} key={l.index}>
      <div className={styles.legislationInfoContainer}>
        <div className={styles.legislationContent}>
          {l.content}
        </div>
        <div className={styles.vetoContent}>
          <div className={styles.vetoInfo}>
            <div>
              <b>{l?.vetos?.length}</b>
              {' '}
              / xyz
            </div>
            <div>Citizens vetoed</div>
          </div>
          <div>
            {
              l?.vetos?.includes(userWalletAddress)
                ? <Button small red onClick={() => revertVetoForLegislation(tier, l.index, userWalletAddress)}>Revert Veto</Button>
                : <Button small primary onClick={() => castVetoForLegislation(tier, l.index, userWalletAddress)}>Cast Veto</Button>
            }
          </div>
        </div>
      </div>
    </Card>
  ));
};

export default LegislationView;

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { congressActions, legislationActions } from '../../../redux/actions';
import { blockchainSelectors, legislationSelectors } from '../../../redux/selectors';
import Card from '../../Card';

import styles from './styles.module.scss';
import Button from '../../Button/Button';
import RepealLegislationButton from '../../Congress/RepealLegislationButton';
import ProposeRepealLegislationButton from '../../Congress/ProposeRepealLegislationButton';

const LegislationView = () => {
  const { tier } = useParams();
  const dispatch = useDispatch();
  const userWalletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);
  const citizens = useSelector(legislationSelectors.citizenCount);

  useEffect(() => {
    dispatch(legislationActions.getLegislation.call({ tier }));
    dispatch(legislationActions.getCitizenCount.call());
    dispatch(congressActions.getMembers.call()); // required by RepealLegislationButton
  }, [dispatch, tier, legislationActions]);

  const legislation = useSelector(legislationSelectors.legislation);

  if (!legislation[tier]) return 'Loading...';

  return legislation[tier].map((l) => (
    <Card className={styles.legislationCard} title={`${l.id.year}-${l.id.index}`} key={l.id}>
      <div className={styles.legislationInfoContainer}>
        <div className={styles.legislationContent}>
          {l.content}
        </div>
        <div className={styles.vetoContent}>
          <div className={styles.vetoInfo}>
            <div>
              {l?.vetos?.length}
              {' '}
              /
              {' '}
              {citizens}
            </div>
            <div>Citizens vetoed</div>
          </div>
          <div>
            {
              l?.vetos?.includes(userWalletAddress)
                ? (
                  <Button
                    small
                    red
                    onClick={() => dispatch(legislationActions.revertVeto.call({
                      tier, id: l.id, userWalletAddress,
                    }))}
                  >
                    Revert Veto
                  </Button>
                )
                : (
                  <Button
                    small
                    primary
                    onClick={() => dispatch(legislationActions.castVeto.call({
                      tier, id: l.id, userWalletAddress,
                    }))}
                  >
                    Cast Veto
                  </Button>
                )
            }
            { tier === 'InternationalTreaty' && <RepealLegislationButton tier={tier} id={l.id} /> }
            { tier !== 'Constitution' && <ProposeRepealLegislationButton tier={tier} id={l.id} /> }
          </div>
        </div>
      </div>
    </Card>
  ));
};

export default LegislationView;

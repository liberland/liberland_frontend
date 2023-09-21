import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { congressActions, legislationActions } from '../../../redux/actions';
import {
  blockchainSelectors,
  legislationSelectors,
} from '../../../redux/selectors';
import Card from '../../Card';

import styles from './styles.module.scss';
import Button from '../../Button/Button';
import RepealLegislationButton from '../../Congress/RepealLegislationButton';
import ProposeRepealLegislationButton from '../../Congress/ProposeRepealLegislationButton';
import AmendLegislationButton from './AmendLegislationButton';
import CongressAmendLegislationButton from './CongressAmendLegislationButton';
import CongressAmendLegislationViaReferendumButton from './CongressAmendLegislationViaReferendumButton';

function VetoStats({ tier, id, section }) {
  const allLegislation = useSelector(legislationSelectors.legislation);
  const legislation = allLegislation[tier][id.year][id.index];
  const vetos = section !== null ? legislation.sections[section].vetos : legislation.vetos;
  const citizens = useSelector(legislationSelectors.citizenCount);

  return (
    <div className={styles.legislationInfoContainer}>
      <div className={styles.rowEnd}>
        <div className={styles.vetoContent}>
          <div className={styles.vetoInfo}>
            {vetos.length}
            {' '}
            /
            {' '}
            {citizens}
            <div>Citizens vetoed</div>
          </div>
        </div>
      </div>
    </div>
  );
}

VetoStats.propTypes = {
  tier: PropTypes.string.isRequired,
  id: PropTypes.shape({
    // eslint-disable-next-line react/forbid-prop-types
    year: PropTypes.object.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    index: PropTypes.object.isRequired,
  }).isRequired,
  section: PropTypes.number.isRequired,
};

function ActionButtons({ tier, id, section }) {
  const dispatch = useDispatch();
  const userWalletAddress = useSelector(
    blockchainSelectors.userWalletAddressSelector,
  );
  const allLegislation = useSelector(legislationSelectors.legislation);
  const legislation = allLegislation[tier][id.year][id.index];
  const vetos = section !== null ? legislation.sections[section].vetos : legislation.vetos;

  return (
    <div className={styles.rowEnd}>
      {vetos.map((v) => v.toString()).includes(userWalletAddress) ? (
        <Button
          medium
          red
          onClick={() => dispatch(
            legislationActions.revertVeto.call({ tier, id, section }),
          )}
        >
          Revert Veto
        </Button>
      ) : (
        <Button
          medium
          primary
          onClick={() => dispatch(
            legislationActions.castVeto.call({ tier, id, section }),
          )}
        >
          Cast Veto
        </Button>
      )}
      {tier === 'InternationalTreaty' && (
        <RepealLegislationButton {...{ tier, id, section }} />
      )}
      {tier !== 'Constitution' && (
        <ProposeRepealLegislationButton {...{ tier, id, section }} />
      )}
      {section !== null && (
      <>
        <AmendLegislationButton {...{ tier, id, section }} />
        { tier === 'InternationalTreaty' && <CongressAmendLegislationButton {...{ tier, id, section }} /> }
        <CongressAmendLegislationViaReferendumButton {...{ tier, id, section }} />
      </>
      )}
    </div>
  );
}

ActionButtons.propTypes = VetoStats.propTypes;

const LegislationView = () => {
  const { tier } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(legislationActions.getLegislation.call({ tier }));
    dispatch(legislationActions.getCitizenCount.call());
    dispatch(congressActions.getMembers.call()); // required by RepealLegislationButton
  }, [dispatch, tier, legislationActions]);

  const legislation = useSelector(legislationSelectors.legislation);

  if (!legislation[tier]) return 'Loading...';

  return Object.entries(legislation[tier]).flatMap(([year, legislations]) => (
    Object.entries(legislations).map(([index, { id, sections }]) => (
      <Card
        className={styles.legislationCard}
        title={`Legislation ${year}/${index}`}
        key={`${year}-${index}`}
      >
        <VetoStats {...{ tier, id, section: null }} />
        <ActionButtons {...{ tier, id, section: null }} />
        {sections.map((v) => (v.content.isSome ? v.content.unwrap().toHuman() : 'Repealed')).map((content, section) => (
          // eslint-disable-next-line react/no-array-index-key
          <Card className={styles.legislationSectionCard} title={`Section #${section}`} key={section}>
            <div className={styles.legislationContent}>{content}</div>
            <VetoStats {...{ tier, id, section }} />
            <ActionButtons {...{ tier, id, section }} />
          </Card>
        ))}
        <AmendLegislationButton add {...{ tier, id, section: sections.length }} />
        { tier === 'InternationalTreaty'
          && <CongressAmendLegislationButton add {...{ tier, id, section: sections.length }} /> }
        <CongressAmendLegislationViaReferendumButton add {...{ tier, id, section: sections.length }} />
      </Card>
    ))));
};

export default LegislationView;

import React, { useEffect, useState } from 'react';
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
import CitizenProposeRepealLegislationButton from '../../Congress/CitizenProposeRepealLegislationButton';
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

function ExistingMotionsAndReferendums({ motion, referendum, proposal }) {
  return (
    <>
      {motion
      && (
      <p>
        Repeal motion:
        <a href={`/home/congress/motions#${motion}`}>{motion}</a>
      </p>
      )}
      {referendum
      && (
      <p>
        Repeal referendum:
        <a href={`/home/voting/referendum#${referendum}`}>{referendum}</a>
      </p>
      )}
      {proposal
      && (
      <p>
        Repeal proposal:
        <a href={`/home/voting/referendum#${proposal}`}>{proposal}</a>
      </p>
      )}
    </>
  );
}

ExistingMotionsAndReferendums.propTypes = {
  motion: PropTypes.string.isRequired,
  referendum: PropTypes.string.isRequired,
  proposal: PropTypes.string.isRequired,

};

function ActionButtons({
  tier, id, section, repealMotion, repealReferendum, repealProposal,
}) {
  const dispatch = useDispatch();
  const userWalletAddress = useSelector(
    blockchainSelectors.userWalletAddressSelector,
  );
  const allLegislation = useSelector(legislationSelectors.legislation);
  const legislation = allLegislation[tier][id.year][id.index];
  const vetos = section !== null ? legislation.sections[section].vetos : legislation.vetos;

  const [isProposeOpen, setProposeOpen] = useState(false);
  const [isAmendOpen, setAmendOpen] = useState(false);

  const isRepealOption = (tier === 'InternationalTreaty' && !repealMotion);
  const isCitizenProposeRepealOption = (!repealReferendum && !repealProposal);
  const isProposeButtonHasOpption = isRepealOption || tier !== 'Constitution' || isCitizenProposeRepealOption;

  return (
    <div className={styles.rowEnd}>
      {vetos.map((v) => v.toString()).includes(userWalletAddress) ? (
        <Button
          small
          red
          onClick={() => dispatch(
            legislationActions.revertVeto.call({ tier, id, section }),
          )}
        >
          Revert Veto
        </Button>
      ) : (
        <Button
          small
          primary
          onClick={() => dispatch(
            legislationActions.castVeto.call({ tier, id, section }),
          )}
        >
          Cast Veto
        </Button>
      )}

      {isProposeButtonHasOpption && (
      <div className={styles.dropdownWrapper}>
        <Button
          small
          primary
          onClick={() => {
            setAmendOpen(false);
            setProposeOpen(!isProposeOpen);
          }}
        >
          Propose \/
        </Button>
        {isProposeOpen && (
        <div className={styles.dropdown}>
          {isRepealOption && (
          <RepealLegislationButton {...{ tier, id, section }} />
          )}
          {tier !== 'Constitution' && (
          <ProposeRepealLegislationButton {...{ tier, id, section }} />
          )}
          {isCitizenProposeRepealOption
            && (
            <CitizenProposeRepealLegislationButton
              {...{ tier, id, section }}
            />
            )}
        </div>
        )}
      </div>
      )}

      <div className={styles.dropdownWrapper}>
        {section !== null && (
          <Button
            small
            primary
            onClick={() => {
              setProposeOpen(false);
              setAmendOpen(!isAmendOpen);
            }}
          >
            Amend \/
          </Button>
        )}
        {isAmendOpen && (
          <div className={styles.dropdown}>

            <AmendLegislationButton {...{ tier, id, section }} />
              { tier === 'InternationalTreaty' && <CongressAmendLegislationButton {...{ tier, id, section }} /> }
            <CongressAmendLegislationViaReferendumButton {...{ tier, id, section }} />

          </div>
        )}
      </div>
    </div>
  );
}

ActionButtons.propTypes = VetoStats.propTypes;

const LegislationView = () => {
  const { tier } = useParams();
  const dispatch = useDispatch();
  const [isAddOpen, setAddOpen] = useState(false);

  useEffect(() => {
    dispatch(legislationActions.getLegislation.call({ tier }));
    dispatch(legislationActions.getCitizenCount.call());

    // required by RepealLegislationButton && CitizenProposeRepealLegislationButton
    dispatch(congressActions.getMembers.call());
  }, [dispatch, tier, legislationActions]);

  const legislation = useSelector(legislationSelectors.legislation);

  if (!legislation[tier]) return 'Loading...';

  return Object.entries(legislation[tier]).flatMap(([year, legislations]) => (
    Object.entries(legislations).map(([index, {
      id,
      sections,
      mainRepealMotion,
      mainRepealReferendum,
      mainRepealProposal,
    }]) => (
      <Card
        className={styles.legislationCard}
        title={`Legislation ${year}/${index}`}
        key={`${year}-${index}`}
      >
        <VetoStats {...{ tier, id, section: null }} />
        <ExistingMotionsAndReferendums
          motion={mainRepealMotion}
          referendum={mainRepealReferendum}
          proposal={mainRepealProposal}
        />

        <ActionButtons {...{
          tier,
          id,
          section: null,
          repealMotion: mainRepealMotion,
          repealReferendum: mainRepealReferendum,
          repealProposal: mainRepealProposal,
        }}
        />
        {sections
          .map(({
            content,
            repealMotion,
            repealReferendum,
            repealProposal,
          }, section) => (
          // eslint-disable-next-line react/no-array-index-key
            <Card className={styles.legislationSectionCard} title={`Section #${section}`} key={section}>
              <div className={styles.legislationContent}>
                { content.isSome ? content.unwrap().toHuman() : 'Repealed' }
              </div>
              <VetoStats {...{ tier, id, section }} />
              <ExistingMotionsAndReferendums
                motion={repealMotion}
                referendum={repealReferendum}
                proposal={repealProposal}
              />
              <ActionButtons {...{
                tier,
                id,
                section,
                repealMotion,
                repealReferendum,
                repealProposal,
              }}
              />
            </Card>
          ))}
        <div className={styles.rowEnd}>
          <div className={styles.dropdownWrapper}>
            <Button
              small
              primary
              onClick={() => setAddOpen(!isAddOpen)}
            >
              Add \/
            </Button>
            {isAddOpen
              && (
              <div className={styles.dropdown}>
                <AmendLegislationButton add {...{ tier, id, section: sections.length }} />
                { tier === 'InternationalTreaty'
                  && <CongressAmendLegislationButton add {...{ tier, id, section: sections.length }} /> }
                <CongressAmendLegislationViaReferendumButton add {...{ tier, id, section: sections.length }} />
              </div>
              )}
          </div>
        </div>
      </Card>
    ))));
};

export default LegislationView;

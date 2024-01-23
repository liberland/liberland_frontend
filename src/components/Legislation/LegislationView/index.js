import React, {
  useEffect, useState, useMemo, useRef,
} from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import cx from 'classnames';
import { useMediaQuery } from 'usehooks-ts';
import { congressActions, legislationActions } from '../../../redux/actions';
import {
  blockchainSelectors,
  legislationSelectors,
} from '../../../redux/selectors';
import Card from '../../Card';

import stylesPage from '../../../utils/pagesBase.module.scss';
import styles from './styles.module.scss';
import Button from '../../Button/Button';
import RepealLegislationButton from '../../Congress/RepealLegislationButton';
import ProposeRepealLegislationButton from '../../Congress/ProposeRepealLegislationButton';
import CitizenProposeRepealLegislationButton from '../../Congress/CitizenProposeRepealLegislationButton';
import AmendLegislationButton from './AmendLegislationButton';
import CongressAmendLegislationButton from './CongressAmendLegislationButton';
import CongressAmendLegislationViaReferendumButton from './CongressAmendLegislationViaReferendumButton';
import Header from './Header';
import useCalculateDropdownPosition from '../../../hooks/useCalculateDropdownPosition';

function VetoStats({
  tier, id, section, isH2,
}) {
  const allLegislation = useSelector(legislationSelectors.legislation);
  const legislation = allLegislation[tier][id.year][id.index];
  const vetos = section !== null ? legislation.sections[section].vetos : legislation.vetos;
  const citizens = useSelector(legislationSelectors.citizenCount);

  return (
    <div className={cx(styles.vetoedWrapper, !isH2 && styles.vetoedWrapperSection)}>
      <span className={styles.vetoedTitle}>Citizens vetoed:</span>
      <span>
        {vetos.length}
        /
        {citizens}
      </span>
    </div>
  );
}

VetoStats.defaultProps = {
  isH2: false,
};

VetoStats.propTypes = {
  tier: PropTypes.string.isRequired,
  id: PropTypes.shape({
    // eslint-disable-next-line react/forbid-prop-types
    year: PropTypes.object.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    index: PropTypes.object.isRequired,
  }).isRequired,
  section: PropTypes.number.isRequired,
  isH2: PropTypes.bool,
};

function ExistingMotionsAndReferendums({ motion, referendum, proposal }) {
  if (!motion && !referendum && !proposal) return null;
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

  const dropdownRefAmend = useRef(null);
  const dropdownRefPropose = useRef(null);
  useCalculateDropdownPosition(isAmendOpen, dropdownRefAmend);
  useCalculateDropdownPosition(isProposeOpen, dropdownRefPropose);

  const isRepealOption = (tier === 'InternationalTreaty' && !repealMotion);
  const isCitizenProposeRepealOption = (!repealReferendum && !repealProposal);
  const isProposeButtonHasOpption = isRepealOption || tier !== 'Constitution' || isCitizenProposeRepealOption;

  return (
    <>
      <div>
        {vetos.map((v) => v.toString()).includes(userWalletAddress) ? (
          <Button
            small
            red
            onClick={() => dispatch(
              legislationActions.revertVeto.call({ tier, id, section }),
            )}
          >
            REVERT VETO
          </Button>
        ) : (
          <Button
            small
            primary
            onClick={() => dispatch(
              legislationActions.castVeto.call({ tier, id, section }),
            )}
          >
            CAST VETO
          </Button>
        )}
      </div>

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
          PROPOSE
          {' '}
          <span>&#x2304;</span>
        </Button>
        {isProposeOpen && (
        <div className={styles.dropdown} ref={dropdownRefPropose}>
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
        {isProposeOpen && <div className={styles.overlay} onClick={() => setProposeOpen((prevValue) => !prevValue)} />}
      </div>
      )}
      {section !== null
      && (
      <div className={styles.dropdownWrapper}>
        <Button
          small
          primary
          onClick={() => setAmendOpen((prevValue) => !prevValue)}
        >
          AMEND
          {' '}
          <span>&#x2304;</span>
        </Button>
        {isAmendOpen && (
          <div className={styles.dropdown} ref={dropdownRefAmend}>
            <AmendLegislationButton {...{ tier, id, section }} />
              { tier === 'InternationalTreaty' && <CongressAmendLegislationButton {...{ tier, id, section }} /> }
            <CongressAmendLegislationViaReferendumButton {...{ tier, id, section }} />
          </div>
        )}
        {isAmendOpen && <div className={styles.overlay} onClick={() => setAmendOpen((prevValue) => !prevValue)} />}
      </div>
      )}
    </>
  );
}

ActionButtons.propTypes = VetoStats.propTypes;

const checkTextToShow = (text, isHidden, isBigScreen, isText) => {
  if (!isText) {
    return 'REPEALED';
  }

  if (isHidden) {
    const maxLength = isBigScreen ? 60 : 40;
    return text.slice(0, maxLength) + (text.length > maxLength ? '...' : '');
  }

  return text;
};

function SectionItem({
  section, repealProposalReferendum, content, tier, id,
}) {
  const {
    repealMotion,
    repealReferendum,
    repealProposal,
  } = repealProposalReferendum;
  const [isHidden, setIsHidden] = useState(true);
  const textButton = 'SECTION';
  const isBigScreen = useMediaQuery('(min-width: 1025px)');
  const text = useMemo(() => checkTextToShow(
    content.unwrap().toHuman(),
    isHidden,
    isBigScreen,
    content.isSome,
  ), [isBigScreen, content, isHidden]);
  return (
    <Card
      className={cx(stylesPage.overviewWrapper, styles.legislationCard)}
      key={id + section}
    >
      <Header isHidden={isHidden} setIsHidden={setIsHidden} textButton={textButton} title={`Section #${section}`}>
        <VetoStats {...{ tier, id, section }} />
      </Header>
      <div className={styles.legislationContent}>
        {text}
      </div>
      {isHidden && (
      <Button
        className={cx(styles.button, styles.buttonSectionHeader)}
        small
        secondary={isHidden}
        grey={!isHidden}
        onClick={() => setIsHidden((prevState) => !prevState)}
      >
        {!isHidden ? 'HIDE' : 'SHOW'}
        {' '}
        {textButton}
      </Button>
      )}
      {!isHidden && (
      <div className={styles.buttonsWrapper}>
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
        <div className={styles.buttonSectionInList}>
          <Button
            className={styles.button}
            small
            secondary={isHidden}
            grey={!isHidden}
            onClick={() => setIsHidden((prevState) => !prevState)}
          >
            {!isHidden ? 'HIDE' : 'SHOW'}
            {' '}
            {textButton}
          </Button>
        </div>

      </div>
      )}
    </Card>
  );
}

SectionItem.defaultProps = {
  section: null,
};

SectionItem.propTypes = {
  section: PropTypes.number,
  // eslint-disable-next-line react/forbid-prop-types
  repealProposalReferendum: PropTypes.object.isRequired,
  content: PropTypes.string.isRequired,
  tier: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};

function LegislationItem({
  year, index, tier, id, sections, mainRepealProposalReferendum,
}) {
  const [isHidden, setIsHidden] = useState(true);
  const [isAddOpen, setAddOpen] = useState(false);
  const dropdownRef = useRef(null);
  const {
    mainRepealMotion,
    mainRepealReferendum,
    mainRepealProposal,
  } = mainRepealProposalReferendum;

  useCalculateDropdownPosition(isAddOpen, dropdownRef);
  return (
    <Card
      className={stylesPage.overviewWrapper}
    >
      <Header
        title={`Legislation ${year}/${index}`}
        isHidden={isHidden}
        isH2
        setIsHidden={() => setIsHidden((prevValue) => !prevValue)}
        textButton="LEGISLATION"
      >
        <VetoStats {...{ tier, id, section: null }} isH2 />
      </Header>

      {!isHidden
            && (
            <>
              <>
                {sections.map(({
                  content, repealMotion, repealReferendum, repealProposal,
                }, section) => (
                  <SectionItem
                    tier={tier}
                    content={content}
                    id={id}
                    section={section}
                    repealProposalReferendum={{
                      repealMotion,
                      repealReferendum,
                      repealProposal,
                    }}
                  />
                ))}
              </>
              <div className={styles.buttonsWrapper}>
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
                <div className={styles.dropdownWrapper}>
                  <Button
                    small
                    primary
                    onClick={() => setAddOpen((prevValue) => !prevValue)}
                  >
                    ADD
                    {' '}
                    <span>&#x2304;</span>
                  </Button>
                  {isAddOpen
                    && (
                    <div className={styles.dropdown} ref={dropdownRef}>
                      <AmendLegislationButton add {...{ tier, id, section: sections.length }} />
                      { tier === 'InternationalTreaty'
                        && <CongressAmendLegislationButton add {...{ tier, id, section: sections.length }} /> }
                      <CongressAmendLegislationViaReferendumButton add {...{ tier, id, section: sections.length }} />
                    </div>
                    )}
                  {isAddOpen && (
                  <div
                    className={styles.overlay}
                    onClick={() => setAddOpen((prevValue) => !prevValue)}
                  />
                  )}
                </div>
              </div>
            </>
            )}
    </Card>
  );
}

LegislationItem.propTypes = {
  year: PropTypes.string.isRequired,
  index: PropTypes.string.isRequired,
  tier: PropTypes.string.isRequired, //
  // eslint-disable-next-line react/forbid-prop-types
  id: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  sections: PropTypes.arrayOf(PropTypes.object).isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  mainRepealProposalReferendum: PropTypes.object.isRequired,
};

function LegislationView() {
  const { tier } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(legislationActions.getLegislation.call({ tier }));
    dispatch(legislationActions.getCitizenCount.call());
    // required by RepealLegislationButton && CitizenProposeRepealLegislationButton
    dispatch(congressActions.getMembers.call());
  }, [dispatch, tier, legislationActions]);

  const legislation = useSelector(legislationSelectors.legislation);

  if (!legislation[tier]) return 'Loading...';
  return (
    <div className={cx(stylesPage.contentWrapper, styles.contentWrapper)}>
      {Object.entries(legislation[tier]).flatMap(([year, legislations]) => (
        Object.entries(legislations).map(([index, {
          id,
          sections,
          mainRepealMotion,
          mainRepealReferendum,
          mainRepealProposal,
        }]) => (
          <LegislationItem
            year={year}
            index={index}
            tier={tier}
            id={id}
            sections={sections}
            mainRepealProposalReferendum={{
              mainRepealMotion,
              mainRepealReferendum,
              mainRepealProposal,
            }}
            key={`${year}-${index}`}
          />
        ))))}
    </div>
  );
}

export default LegislationView;

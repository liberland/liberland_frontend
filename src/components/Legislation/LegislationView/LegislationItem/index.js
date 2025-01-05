import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Space from 'antd/es/space';
import Splitter from 'antd/es/splitter';
import DownOutlined from '@ant-design/icons/DownOutlined';
import useCalculateDropdownPosition from '../../../../hooks/useCalculateDropdownPosition';
import Header from '../Header';
import VetoStats from '../VetoStats';
import SectionItem from '../SectionItem';
import styles from '../styles.module.scss';
import ExistingMotionsAndReferendums from '../ExistingMotionsAndReferendums';
import ActionButtons from '../ActionButtons';
import Button from '../../../Button/Button';
import ProposeAmendLegislationModalWrapper from '../../../Modals/ProposeAmendLegislationModal';
import CongressAmendLegislationModalWrapper from '../../../Modals/CongressAmendLegislationModal';
import CongressAmendLegislationViaReferendumModal from '../../../Modals/CongressAmendLegislationViaReferendumModal';

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
    <Splitter.Panel>
      <Header
        title={`Legislation ${year}/${index}`}
        isHidden={isHidden}
        isH2
        setIsHidden={() => setIsHidden((prevValue) => !prevValue)}
        textButton="LEGISLATION"
      >
        <VetoStats
          tier={tier}
          id={id}
          isH2
        />
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
                    content={content.unwrap()}
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
                <ActionButtons
                  tier={tier}
                  id={id}
                  repealMotion={mainRepealMotion}
                />
                <div className={styles.dropdownWrapper}>
                  <Button
                    primary
                    onClick={() => setAddOpen((prevValue) => !prevValue)}
                  >
                    ADD
                    <Space />
                    <DownOutlined />
                  </Button>
                  {isAddOpen
                    && (
                    <div className={styles.dropdown} ref={dropdownRef}>
                      <ProposeAmendLegislationModalWrapper
                        add
                        tier={tier}
                        id={id}
                        section={sections.length}
                      />
                      {tier === 'InternationalTreaty' && (
                        <CongressAmendLegislationModalWrapper
                          add
                          tier={tier}
                          id={id}
                          section={sections.length}
                        />
                      )}
                      <CongressAmendLegislationViaReferendumModal
                        add
                        tier={tier}
                        id={id}
                        section={sections.length}
                      />
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
    </Splitter.Panel>
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

export default LegislationItem;

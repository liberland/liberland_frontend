import React from 'react';
import PropTypes from 'prop-types';
import Space from 'antd/es/space';
import Collapse from 'antd/es/collapse';
import DownOutlined from '@ant-design/icons/DownOutlined';
import Dropdown from 'antd/es/dropdown';
import Flex from 'antd/es/flex';
import VetoStats from '../VetoStats';
import SectionItem from '../SectionItem';
import ExistingMotionsAndReferendums from '../ExistingMotionsAndReferendums';
import ActionButtons from '../ActionButtons';
import Button from '../../../Button/Button';
import ProposeAmendLegislationModalWrapper from '../../../Modals/ProposeAmendLegislationModal';
import CongressAmendLegislationModalWrapper from '../../../Modals/CongressAmendLegislationModal';
import CongressAmendLegislationViaReferendumModal from '../../../Modals/CongressAmendLegislationViaReferendumModal';

function LegislationItem({
  year, index, tier, id, sections, mainRepealProposalReferendum,
}) {
  const {
    mainRepealMotion,
    mainRepealReferendum,
    mainRepealProposal,
  } = mainRepealProposalReferendum;

  return (
    <Collapse
      items={[{
        label: `Legislation ${year}/${index}`,
        key: 'legislation',
        extra: (
          <VetoStats
            tier={tier}
            id={id}
            isH2
          />
        ),
        children: (
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
            <Flex wrap gap="15px">
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
              <Dropdown
                menu={{
                  items: [
                    [
                      <ProposeAmendLegislationModalWrapper
                        add
                        tier={tier}
                        id={id}
                        section={sections.length}
                      />,
                      tier === 'InternationalTreaty' && (
                        <CongressAmendLegislationModalWrapper
                          add
                          tier={tier}
                          id={id}
                          section={sections.length}
                        />
                      ),
                      <CongressAmendLegislationViaReferendumModal
                        add
                        tier={tier}
                        id={id}
                        section={sections.length}
                      />,
                    ].filter(Boolean).map((children, key) => ({
                      children,
                      key,
                    })),
                  ],
                }}
              >
                <Button primary>
                  Add
                  <Space />
                  <DownOutlined />
                </Button>
              </Dropdown>
            </Flex>
          </>
        ),
      }]}
    />
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

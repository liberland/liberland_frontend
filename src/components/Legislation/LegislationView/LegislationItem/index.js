import React from 'react';
import PropTypes from 'prop-types';
import Space from 'antd/es/space';
import Collapse from 'antd/es/collapse';
import DownOutlined from '@ant-design/icons/DownOutlined';
import Dropdown from 'antd/es/dropdown';
import Card from 'antd/es/card';
import List from 'antd/es/list';
import Flex from 'antd/es/flex';
import VetoStats from '../VetoStats';
import SectionItem from '../SectionItem';
import Button from '../../../Button/Button';
import ProposeAmendLegislationModalWrapper from '../../../Modals/ProposeAmendLegislationModal';
import CongressAmendLegislationModalWrapper from '../../../Modals/CongressAmendLegislationModal';
import CongressAmendLegislationViaReferendumModal from '../../../Modals/CongressAmendLegislationViaReferendumModal';
import CastVeto from '../CastVeto';
import ProposeButton from '../ProposeButton';
import AmendButton from '../AmendButton';
import styles from '../styles.module.scss';

function LegislationItem({
  year, index, tier, id, sections,
}) {
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
          <Card
            title="Sections"
            actions={[
              <Flex className={styles.actions} justify="end" wrap gap="15px">
                <CastVeto
                  id={id}
                  tier={tier}
                />
                <ProposeButton
                  id={id}
                  tier={tier}
                />
                <AmendButton
                  id={id}
                  tier={tier}
                />
                <Dropdown
                  trigger={['click']}
                  menu={{
                    items: [
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
                    ].filter(Boolean).map((label, key) => ({
                      label,
                      key,
                    })),
                  }}
                >
                  <Button primary>
                    Add
                    <Space />
                    <DownOutlined />
                  </Button>
                </Dropdown>
              </Flex>,
            ]}
          >
            <List
              dataSource={sections}
              renderItem={({
                content,
              }, section) => (
                <List.Item>
                  <SectionItem
                    tier={tier}
                    content={content}
                    id={id}
                    section={section}
                  />
                </List.Item>
              )}
            />
          </Card>
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
};

export default LegislationItem;

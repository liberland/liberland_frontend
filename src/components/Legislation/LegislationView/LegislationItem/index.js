import React from 'react';
import PropTypes from 'prop-types';
import Collapse from 'antd/es/collapse';
import Card from 'antd/es/card';
import List from 'antd/es/list';
import Flex from 'antd/es/flex';
import VetoStats from '../VetoStats';
import SectionItem from '../SectionItem';
import { useTitleFromMarkdown } from '../../../Voting/Referendum/Items/hooks';
import truncate from '../../../../utils/truncate';
import CastVeto from '../CastVeto';
import ProposeButton from '../ProposeButton';
import AmendButton from '../AmendButton';
import styles from '../styles.module.scss';

function LegislationItem({
  year, index, tier, id, sections,
}) {
  const { title, setTitleFromRef } = useTitleFromMarkdown(false, `Legislation ${year}/${index}`);
  return (
    <Collapse
      items={[{
        label: truncate(title, 50),
        key: 'legislation',
        extra: (
          <VetoStats
            tier={tier}
            id={id}
            isH2
          />
        ),
        forceRender: true,
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
                  section={sections.length}
                />
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
                    paragraphRef={section === 0 ? setTitleFromRef : undefined}
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

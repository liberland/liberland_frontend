import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { hexToString, isHex } from '@polkadot/util';
import Paragraph from 'antd/es/typography/Paragraph';
import Card from 'antd/es/card';
import Flex from 'antd/es/flex';
import Markdown from 'markdown-to-jsx';
import VetoStats from '../VetoStats';
import ProposeButton from '../ProposeButton';
import AmendButton from '../AmendButton';
import CastVeto from '../CastVeto';
import styles from '../styles.module.scss';

const checkTextToShow = (content) => {
  if (!content.isSome) {
    return 'Repealed';
  }
  const human = content.unwrap().toHuman();
  if (isHex(human)) {
    return hexToString(human) || '';
  }
  return human || '';
};

function SectionItem({
  section, content, tier, id,
}) {
  const text = useMemo(() => checkTextToShow(
    content,
  ), [content]);

  return (
    <Card
      title={`Section #${section}`}
      extra={(
        <VetoStats
          tier={tier}
          id={id}
          section={section}
        />
      )}
      className={styles.card}
      actions={[
        <Flex className={styles.actions} justify="end" wrap gap="15px">
          <CastVeto
            id={id}
            tier={tier}
            section={section}
          />
          <ProposeButton
            id={id}
            tier={tier}
            section={section}
          />
          <AmendButton
            id={id}
            tier={tier}
          />
        </Flex>,
      ]}
    >
      <Paragraph
        className={styles.paragraph}
      >
        <Markdown options={{ disableParsingRawHTML: true }}>
          {text}
        </Markdown>
      </Paragraph>
    </Card>
  );
}

SectionItem.defaultProps = {
  section: null,
};

SectionItem.propTypes = {
  section: PropTypes.number,
  // eslint-disable-next-line react/forbid-prop-types
  content: PropTypes.object.isRequired,
  tier: PropTypes.string.isRequired,
  id: PropTypes.shape({
    // eslint-disable-next-line react/forbid-prop-types
    year: PropTypes.object.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    index: PropTypes.object.isRequired,
  }).isRequired,
};

export default SectionItem;

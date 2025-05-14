import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { hexToString, isHex } from '@polkadot/util';
import Paragraph from 'antd/es/typography/Paragraph';
import Card from 'antd/es/card';
import Flex from 'antd/es/flex';
import Result from 'antd/es/result';
import Markdown from 'markdown-to-jsx';
import VetoStats from '../VetoStats';
import ProposeButton from '../ProposeButton';
import AmendButton from '../AmendButton';
import CastVeto from '../CastVeto';
import styles from '../styles.module.scss';

const tryParseToShow = (content) => {
  if (!content.isSome) {
    return [false];
  }
  const human = content.unwrap().toHuman();
  if (!human) {
    return [false];
  }
  if (isHex(human)) {
    return [true, hexToString(human) || ''];
  }
  return [true, human || ''];
};

function SectionItem({
  section, content, tier, id,
}) {
  const [hasContent, text] = useMemo(() => tryParseToShow(
    content,
  ), [content]);

  if (!hasContent) {
    return (
      <Result
        className="warning-result warning-result--borderless warning-result--flat"
        title={`Section #${section} is repealed`}
        status="warning"
      />
    );
  }

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

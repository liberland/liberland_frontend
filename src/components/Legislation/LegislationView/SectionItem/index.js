import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useMediaQuery } from 'usehooks-ts';
import Paragraph from 'antd/es/typography/Paragraph';
import Card from 'antd/es/card';
import Flex from 'antd/es/flex';
import VetoStats from '../VetoStats';
import ProposeButton from '../ProposeButton';
import AmendButton from '../AmendButton';
import CastVeto from '../CastVeto';
import ExistingMotionsAndReferendums from '../ExistingMotionsAndReferendums';
import styles from '../styles.module.scss';

const checkTextToShow = (content) => {
  if (!content.isSome) {
    return 'Repealed';
  }
  return content.unwrap().toHuman();
};

function SectionItem({
  section, repealProposalReferendum, content, tier, id,
}) {
  const {
    repealMotion,
    repealReferendum,
    repealProposal,
  } = repealProposalReferendum;
  const isBigScreen = useMediaQuery('(min-width: 1025px)');

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
      actions={[
        <Flex className={styles.actions} justify="end" wrap gap="15px">
          <ExistingMotionsAndReferendums
            motion={repealMotion}
            proposal={repealReferendum}
            referendum={repealProposal}
          />
          <CastVeto
            id={id}
            tier={tier}
            section={section}
          />
          <ProposeButton
            id={id}
            tier={tier}
            section={section}
            repealMotion={repealMotion}
          />
          <AmendButton
            id={id}
            tier={tier}
          />
        </Flex>,
      ]}
    >
      <Card.Meta
        description={(
          <Paragraph ellipsis={{ rows: isBigScreen ? 60 : 40, expandable: true }}>
            {text}
          </Paragraph>
        )}
      />
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

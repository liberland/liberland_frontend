import React from 'react';
import PropTypes from 'prop-types';
import { useMediaQuery } from 'usehooks-ts';
import Paragraph from 'antd/es/typography/Paragraph';
import Card from 'antd/es/card';
import VetoStats from '../VetoStats';
import ExistingMotionsAndReferendums from '../ExistingMotionsAndReferendums';
import ActionButtons from '../ActionButtons';

function SectionItem({
  section, repealProposalReferendum, content, tier, id,
}) {
  const {
    repealMotion,
    repealReferendum,
    repealProposal,
  } = repealProposalReferendum;
  const isBigScreen = useMediaQuery('(min-width: 1025px)');

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
        <ExistingMotionsAndReferendums
          motion={repealMotion}
          referendum={repealReferendum}
          proposal={repealProposal}
        />,
        <ActionButtons
          tier={tier}
          id={id}
          section={section}
          repealMotion={repealMotion}
        />,
      ]}
    >
      <Card.Meta
        description={(
          <Paragraph ellipsis={{ rows: isBigScreen ? 60 : 40, expandable: true }}>
            {content}
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
  content: PropTypes.string.isRequired,
  tier: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};

export default SectionItem;

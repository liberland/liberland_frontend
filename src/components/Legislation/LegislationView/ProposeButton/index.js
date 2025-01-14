import React from 'react';
import PropTypes from 'prop-types';
import Space from 'antd/es/space';
import Dropdown from 'antd/es/dropdown';
import DownOutlined from '@ant-design/icons/DownOutlined';
import Button from '../../../Button/Button';
import CongressRepealLegislationModalWrapper from '../../../Modals/CongressRepealLegislationModal';
import ProposeRepealLegislationButton from '../../../Congress/ProposeRepealLegislationButton';
import CitizenRepealLegislationModalWrapper from '../../../Modals/CitizenRepealLegislationModal';

function ProposeButton({
  tier, id, section, repealMotion,
}) {
  const isRepealOption = (tier === 'InternationalTreaty' && !repealMotion);
  const isProposeButton = isRepealOption || tier !== 'Constitution';

  return isProposeButton ? (
    <Dropdown
      trigger={['click']}
      menu={{
        items: [
          isRepealOption && (
            <CongressRepealLegislationModalWrapper
              tier={tier}
              id={id}
              section={section}
            />
          ),
          tier !== 'Constitution' && (
            <ProposeRepealLegislationButton
              tier={tier}
              id={id}
              section={section}
            />
          ),
          <CitizenRepealLegislationModalWrapper
            tier={tier}
            id={id}
            section={section}
          />,
        ].filter(Boolean).map((label, key) => ({
          label,
          key,
        })),
      }}
    >
      <Button primary>
        Propose
        <Space />
        <DownOutlined />
      </Button>
    </Dropdown>
  ) : <div />;
}

ProposeButton.propTypes = {
  tier: PropTypes.string.isRequired,
  id: PropTypes.shape({
    // eslint-disable-next-line react/forbid-prop-types
    year: PropTypes.object.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    index: PropTypes.object.isRequired,
  }).isRequired,
  section: PropTypes.number,
  repealMotion: PropTypes.bool,
};

export default ProposeButton;

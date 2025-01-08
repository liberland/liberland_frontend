import React from 'react';
import PropTypes from 'prop-types';
import Space from 'antd/es/space';
import Dropdown from 'antd/es/dropdown';
import DownOutlined from '@ant-design/icons/DownOutlined';
import Button from '../../../Button/Button';
import ProposeAmendLegislationModalWrapper from '../../../Modals/ProposeAmendLegislationModal';
import CongressAmendLegislationModalWrapper from '../../../Modals/CongressAmendLegislationModal';
import CongressAmendLegislationViaReferendumModal from '../../../Modals/CongressAmendLegislationViaReferendumModal';

function AmendButton({
  tier, id, section,
}) {
  return typeof section === 'number' ? (
    <Dropdown
      trigger={['click']}
      menu={{
        items: [
          <ProposeAmendLegislationModalWrapper
            tier={tier}
            id={id}
            section={section}
          />,
          tier === 'InternationalTreaty' && (
            <CongressAmendLegislationModalWrapper
              tier={tier}
              id={id}
              section={section}
            />
          ),
          <CongressAmendLegislationViaReferendumModal
            tier={tier}
            id={id}
            section={section}
          />,
        ].filter(Boolean).map((label, index) => ({
          label,
          index,
        })),
      }}
    >
      <Button primary>
        Amend
        <Space />
        <DownOutlined />
      </Button>
    </Dropdown>
  ) : null;
}

AmendButton.propTypes = {
  tier: PropTypes.string.isRequired,
  id: PropTypes.shape({
    // eslint-disable-next-line react/forbid-prop-types
    year: PropTypes.object.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    index: PropTypes.object.isRequired,
  }).isRequired,
  section: PropTypes.number,
};

export default AmendButton;

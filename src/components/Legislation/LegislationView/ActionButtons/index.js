import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import Space from 'antd/es/space';
import Dropdown from 'antd/es/dropdown';
import DownOutlined from '@ant-design/icons/DownOutlined';
import { blockchainSelectors, legislationSelectors } from '../../../../redux/selectors';
import Button from '../../../Button/Button';
import { legislationActions } from '../../../../redux/actions';
import CongressRepealLegislationModalWrapper from '../../../Modals/CongressRepealLegislationModal';
import ProposeRepealLegislationButton from '../../../Congress/ProposeRepealLegislationButton';
import CitizenRepealLegislationModalWrapper from '../../../Modals/CitizenRepealLegislationModal';
import ProposeAmendLegislationModalWrapper from '../../../Modals/ProposeAmendLegislationModal';
import CongressAmendLegislationModalWrapper from '../../../Modals/CongressAmendLegislationModal';
import CongressAmendLegislationViaReferendumModal from '../../../Modals/CongressAmendLegislationViaReferendumModal';

function ActionButtons({
  tier, id, section, repealMotion,
}) {
  const dispatch = useDispatch();
  const userWalletAddress = useSelector(
    blockchainSelectors.userWalletAddressSelector,
  );
  const allLegislation = useSelector(legislationSelectors.legislation);
  const legislation = allLegislation[tier][id.year][id.index];
  const vetos = section !== null ? (legislation?.sections?.[section]?.vetos || []) : legislation.vetos;

  const isRepealOption = (tier === 'InternationalTreaty' && !repealMotion);
  const isProposeButtonHasOpption = isRepealOption || tier !== 'Constitution';

  return (
    <>
      <div>
        {vetos.map((v) => v.toString()).includes(userWalletAddress) ? (
          <Button
            red
            onClick={() => dispatch(
              legislationActions.revertVeto.call({ tier, id, section }),
            )}
          >
            REVERT VETO
          </Button>
        ) : (
          <Button
            primary
            onClick={() => dispatch(
              legislationActions.castVeto.call({ tier, id, section }),
            )}
          >
            CAST VETO
          </Button>
        )}
      </div>

      {isProposeButtonHasOpption && (
        <Dropdown
          menu={{
            items: [
              [
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
              ].filter(Boolean).map((children, key) => ({
                children,
                key,
              })),
            ],
          }}
        >
          <Button primary>
            PROPOSE
            <Space />
            <DownOutlined />
          </Button>
        </Dropdown>
      )}
      {section !== null && (
        <Dropdown
          menu={[
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
          ].filter(Boolean)}
        >
          <Button primary>
            Amend
            {' '}
            <span>&#x2304;</span>
          </Button>
        </Dropdown>
      )}
    </>
  );
}

ActionButtons.propTypes = {
  tier: PropTypes.string.isRequired,
  id: PropTypes.shape({
    // eslint-disable-next-line react/forbid-prop-types
    year: PropTypes.object.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    index: PropTypes.object.isRequired,
  }).isRequired,
  section: PropTypes.number.isRequired,
  repealMotion: PropTypes.bool,
};

export default ActionButtons;

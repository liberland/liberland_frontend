import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { blockchainSelectors, legislationSelectors } from '../../../../redux/selectors';
import { legislationActions } from '../../../../redux/actions';
import Button from '../../../Button/Button';

function CastVeto({
  tier, id, section,
}) {
  const dispatch = useDispatch();
  const userWalletAddress = useSelector(
    blockchainSelectors.userWalletAddressSelector,
  );
  const allLegislation = useSelector(legislationSelectors.legislation);
  const legislation = allLegislation[tier][id.year][id.index];
  const vetos = typeof section === 'number' ? (legislation?.sections?.[section]?.vetos || []) : legislation.vetos;

  return vetos.map((v) => v.toString()).includes(userWalletAddress) ? (
    <Button
      red
      onClick={() => dispatch(
        legislationActions.revertVeto.call({ tier, id, section }),
      )}
    >
      Revert veto
    </Button>
  ) : (
    <Button
      primary
      onClick={() => dispatch(
        legislationActions.castVeto.call({ tier, id, section }),
      )}
    >
      Cast veto
    </Button>
  );
}

CastVeto.propTypes = {
  tier: PropTypes.string.isRequired,
  id: PropTypes.shape({
    // eslint-disable-next-line react/forbid-prop-types
    year: PropTypes.object.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    index: PropTypes.object.isRequired,
  }).isRequired,
  section: PropTypes.number,
};

export default CastVeto;

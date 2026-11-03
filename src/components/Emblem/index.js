import React from 'react';
import PropTypes from 'prop-types';
import { useModeContext } from '../AntdProvider';
import stateEscutcheon from '../../assets/images/state-escutcheon.png';
import ledgerEmblem from '../../assets/images/liberlandEmblem.svg';

/*
 * The Liberland coat of arms, in whichever rendering the active design
 * language specifies.
 *
 * The two languages ship different artwork for the same arms — the Ledger's
 * vector emblem and the State language's escutcheon — and before this existed
 * the choice was made independently wherever the arms happened to be drawn, so
 * the two could disagree on the same screen. Routing every use through one
 * component means selecting a language changes the arms everywhere at once.
 *
 * The arms are not square: both files are taller than they are wide, so the
 * box is sized by height and the width is left to `object-fit` rather than
 * stretched to whatever the surrounding layout happens to be.
 */
function Emblem({ height, className, alt }) {
  const { isStateDesign } = useModeContext();
  return (
    <img
      src={isStateDesign ? stateEscutcheon : ledgerEmblem}
      alt={alt}
      className={className}
      style={{ height, width: 'auto', objectFit: 'contain' }}
      data-testid="liberland-emblem"
      data-design={isStateDesign ? 'state' : 'ledger'}
    />
  );
}

Emblem.propTypes = {
  height: PropTypes.number.isRequired,
  className: PropTypes.string,
  alt: PropTypes.string,
};

Emblem.defaultProps = {
  alt: 'Coat of arms of Liberland',
};

export default Emblem;

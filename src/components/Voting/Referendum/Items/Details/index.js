import React, { useState } from 'react';
import PropTypes from 'prop-types';
import stylesItem from '../item.module.scss';
import { Proposal, Preimage } from '../../../../Proposal';
import Button from '../../../../Button/Button';

function Details({ proposal, isProposal }) {
  const [isDetailsHidden, setIsDetailsHidden] = useState(true);
  return (
    <div className={stylesItem.greyWrapper}>
      <div className={stylesItem.smallHeader}>
        <h4 className={stylesItem.title}>Details</h4>
        {isProposal ? <Preimage {...{ ...proposal }} isDetailsHidden={isDetailsHidden} />
          : <Proposal {...{ proposal }} isDetailsHidden={isDetailsHidden} />}
      </div>
      <Button
        className={stylesItem.button}
        small
        secondary={isDetailsHidden}
        grey={!isDetailsHidden}
        onClick={() => setIsDetailsHidden((prevState) => !prevState)}
      >
        {!isDetailsHidden ? 'HIDE' : 'SHOW'}
        {' '}
        DETAILS
      </Button>
    </div>
  );
}

Details.defaultProps = {
  isProposal: false,
};

Details.propTypes = {
  proposal: PropTypes.instanceOf(Map).isRequired,
  isProposal: PropTypes.bool,
};

export default Details;

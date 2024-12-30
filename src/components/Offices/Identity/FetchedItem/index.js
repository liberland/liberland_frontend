import React from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { officesActions } from '../../../../redux/actions';
import Button from '../../../Button/Button';

function FetchedItem({ address }) {
  const dispatch = useDispatch();
  return (
    <div>
      {address}
      <Button onClick={() => dispatch(officesActions.officeGetIdentity.call(address))}>
        fetch
      </Button>
    </div>
  );
}
FetchedItem.propTypes = {
  address: PropTypes.string.isRequired,
};

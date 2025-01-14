import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import Card from 'antd/es/card';
import { officesActions } from '../../../../redux/actions';
import Button from '../../../Button/Button';

function UnregisterCompany({ entityId }) {
  const dispatch = useDispatch();
  const unregisterCompany = () => {
    dispatch(officesActions.unregisterCompany.call({
      entityId,
      soft: true,
    }));
  };
  return (
    <Card
      title="User requested company unregistration"
      actions={[
        <Button
          red
          onClick={() => unregisterCompany()}
        >
          Approve request & Unregister company
        </Button>,
      ]}
    />
  );
}

UnregisterCompany.propTypes = {
  entityId: PropTypes.string.isRequired,
};

export default UnregisterCompany;

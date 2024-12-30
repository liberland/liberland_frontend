import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { officesActions } from '../../../../redux/actions';
import styles from '../styles.module.scss';
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
    <div>
      <p>User requested company unregistration.</p>
      <div className={styles.buttonWrapper}>
        <Button
          primary
          medium
          red
          onClick={() => unregisterCompany()}
        >
          Approve request & Unregister company
        </Button>
      </div>
    </div>
  );
}

UnregisterCompany.propTypes = {
  entityId: PropTypes.string.isRequired,
};

export default UnregisterCompany;

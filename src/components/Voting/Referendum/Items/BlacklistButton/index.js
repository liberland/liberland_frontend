import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Button from '../../../../Button/Button';
import { congressActions } from '../../../../../redux/actions';
import { congressSelectors } from '../../../../../redux/selectors';

function BlacklistButton({ hash }) {
  const dispatch = useDispatch();
  const userIsMember = useSelector(congressSelectors.userIsMember);

  useEffect(() => {
    dispatch(congressActions.getMembers.call());
  }, [dispatch]);

  const blacklistMotion = () => {
    dispatch(congressActions.congressDemocracyBlacklist.call({ hash }));
  };

  if (!userIsMember) {
    return null;
  }

  return (
    <Button onClick={blacklistMotion}>
      Cancel
    </Button>
  );
}

BlacklistButton.propTypes = { hash: PropTypes.string.isRequired };

export default BlacklistButton;

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { routeSelectors } from '../../redux/selectors';
import { routeActions } from '../../redux/actions';

function ChangeRoute() {
  const routeLink = useSelector(routeSelectors.routeLink);
  const dispatch = useDispatch();

  const history = useHistory();

  useEffect(() => {
    if (routeLink) {
      setTimeout(() => {
        history.push(routeLink);
        dispatch(routeActions.changeRoute.call());
      }, 2000);
    }
  }, [dispatch, history, routeLink]);
  return (
    <div />
  );
}

export default ChangeRoute;

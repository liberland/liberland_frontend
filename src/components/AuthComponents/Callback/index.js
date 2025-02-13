import React, { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import useLogin from '../../../hooks/useLogin';

export default function RedirectHandler() {
  const history = useHistory();
  const location = useLocation();
  const login = useLogin(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);

    const returnTo = urlParams.get('state') || '/';

    history.push(returnTo);
  }, [history, location.search, login]);

  return <div />;
}

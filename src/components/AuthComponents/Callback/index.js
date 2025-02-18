import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

export default function RedirectHandler() {
  const history = useHistory();

  useEffect(() => {
    const savedState = sessionStorage.getItem('ROCP_auth_state') || '/';
    history.push(savedState);
  }, [history]);

  return <div />;
}

import { useEffect } from 'react';
import useLogin from '../../../hooks/useLogin';

function SignIn() {
  const login = useLogin();
  useEffect(() => {
    login?.();
  }, [login]);
  return null;
}

export default SignIn;

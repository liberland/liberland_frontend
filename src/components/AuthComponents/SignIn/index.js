import { useContext, useEffect } from 'react';
import { AuthContext } from 'react-oauth2-code-pkce';

function SignIn() {
  const { login } = useContext(AuthContext);
  useEffect(() => {
    if (login) {
      login();
    }
  }, [login]);
  return null;
}

export default SignIn;

import { useContext } from 'react';
import { AuthContext } from 'react-oauth2-code-pkce';

export default function useLogin(skipChecksMobile) {
  const { login } = useContext(AuthContext);

  const isMobile = /iPhone|iPad|iPod|Android|webOS|BlackBerry|Windows Phone|Opera Mini|IEMobile|Mobile/i.test(
    navigator.userAgent,
  );

  const loginWithSaveLocation = async () => {
    const currentPath = `${window.location.pathname}${window.location.search}`;

    if (isMobile && !skipChecksMobile) {
      window.location.href = `${process.env.REACT_APP_SUBWALLET_LINK}${currentPath.slice(1)}?mobileLogin=true`;
      return;
    }

    login(currentPath);
  };

  return loginWithSaveLocation;
}

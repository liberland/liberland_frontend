import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { navigationList } from '../../constants/navigationList';

export function useNavigationList() {
  const { pathname } = useLocation();

  const matchedSubLink = useMemo(() => navigationList.find(
    ({ subLinks }) => (
      Object.values(subLinks).some((sub) => sub === pathname)
        || Object.values(subLinks).some((sub) => pathname.startsWith(sub))
    ),
  ), [pathname]);
  const matchedRoute = useMemo(
    () => navigationList.find(({ route }) => route === pathname)
      || navigationList.find(({ route }) => pathname.startsWith(route)),
    [pathname],
  );

  return {
    navigationList,
    matchedRoute,
    matchedSubLink,
    pathname,
  };
}

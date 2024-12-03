import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { navigationList as navigationListComplete } from '../../constants/navigationList';
import { userSelectors } from '../../redux/selectors';

export function useNavigationList() {
  const roles = useSelector(userSelectors.selectUserRole);
  const { pathname } = useLocation();
  const navigationList = useMemo(
    () => navigationListComplete.filter(({ access }) => (roles[access] && roles[access] !== 'guest')
      || access.some((role) => roles.includes(role))),
    [roles],
  );

  const matchedSubLink = useMemo(() => navigationList.find(
    ({ subLinks }) => (
      Object.values(subLinks).some((sub) => sub === pathname)
        || Object.values(subLinks).some((sub) => pathname.startsWith(sub))
    ),
  ), [navigationList, pathname]);
  const matchedRoute = useMemo(
    () => navigationList.find(({ route }) => route === pathname)
      || navigationList.find(({ route }) => pathname.startsWith(route)),
    [navigationList, pathname],
  );

  return {
    navigationList,
    matchedRoute,
    matchedSubLink,
    pathname,
  };
}

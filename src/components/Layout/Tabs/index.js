import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import Spin from 'antd/es/spin';
import { useNavigationList } from '../hooks';

function Tabs({ children }) {
  const history = useHistory();
  const {
    matchedRoute,
    matchedSubLink,
    pathname,
  } = useNavigationList();

  const tabs = useMemo(() => {
    if (matchedSubLink) {
      return Object.entries(matchedSubLink.subLinks);
    }
    if (matchedRoute) {
      return Object.entries(matchedRoute.subLinks);
    }
    return [];
  }, [matchedSubLink, matchedRoute]);

  const hasTab = tabs.find(([_, url]) => url === pathname);

  return tabs?.length && hasTab ? (
    <Tabs
      activeKey={pathname}
      onChange={(activeKey) => {
        history.push(activeKey);
      }}
      items={tabs.map(([title, url]) => ({
        key: url,
        label: title,
        children: pathname === url ? children : <Spin size="large" />,
      }))}
    />
  ) : children;
}

Tabs.propTypes = {
  children: PropTypes.node,
};

export default Tabs;

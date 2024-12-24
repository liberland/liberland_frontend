import React, { useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import TabsInternal from 'antd/es/tabs';
import Spin from 'antd/es/spin';
import { useNavigationList } from '../hooks';

function Tabs() {
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
    <TabsInternal
      activeKey={pathname}
      onChange={(activeKey) => {
        history.push(activeKey);
      }}
      items={tabs.map(([title, url]) => ({
        key: url,
        label: title,
        children: pathname === url ? null : <Spin size="large" />,
      }))}
    />
  ) : null;
}

export default Tabs;

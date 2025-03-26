import React, { useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import TabsInternal from 'antd/es/tabs';
import Spin from 'antd/es/spin';
import classNames from 'classnames';
import { useNavigationList } from '../hooks';
import styles from '../styles.module.scss';

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

  const isDiscouraged = (url) => matchedRoute?.subDiscouraged?.includes(url)
    || matchedSubLink?.subDiscouraged?.includes(url);

  const hasTab = tabs.find(([_, url]) => url === pathname);

  return tabs?.length && hasTab ? (
    <TabsInternal
      type="card"
      activeKey={pathname}
      onChange={(activeKey) => {
        if (!isDiscouraged(activeKey)) {
          history.push(activeKey);
        }
      }}
      items={tabs.map(([title, url]) => {
        const className = classNames({
          [styles.discouraged]: isDiscouraged(url),
        });
        return {
          key: url,
          label: (
            <div className={className}>
              {title}
            </div>
          ),
          children: pathname === url ? null : <Spin size="large" />,
        };
      })}
    />
  ) : null;
}

export default Tabs;

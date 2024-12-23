import React from 'react';
import classNames from 'classnames';
import Menu from 'antd/es/menu';
import MenuIcon from '@ant-design/icons/MenuOutlined';
import { useLocation, useHistory } from 'react-router-dom';
import { useMediaQuery } from 'usehooks-ts';
import styles from '../styles.module.scss';
import { useNavigationList } from '../hooks';
import { navigationList } from '../../../constants/navigationList';

function UrlMenu() {
  const isBiggerThanDesktop = useMediaQuery('(min-width: 992px)');
  const isBiggerThanSmallScreen = useMediaQuery('(min-width: 768px)');
  const { pathname } = useLocation();
  const history = useHistory();
  const getMenuKey = () => {
    if (isBiggerThanDesktop) {
      return 'large';
    }
    if (isBiggerThanSmallScreen) {
      return 'desktop';
    }
    return 'small';
  };
  const { matchedSubLink } = useNavigationList();
  const openKeys = React.useMemo(() => {
    const matchOpen = matchedSubLink;
    return {
      citizen: true,
      state: true,
      [matchOpen ? matchOpen.route : pathname]: true,
    };
  }, [matchedSubLink, pathname]);
  const createMenu = (navigation) => {
    const subs = Object.entries(navigation.subLinks).map(([name, link]) => ({
      label: name,
      key: link,
      onClick: () => history.push(link),
    }));
    return {
      icon: <img src={navigation.icon} alt="icon" className={styles.icon} />,
      label: <span className={classNames({ [styles.discouraged]: navigation.isDiscouraged })}>{navigation.title}</span>,
      key: navigation.route,
      onClick: subs.length ? undefined : () => history.push(navigation.route),
      onTitleClick: !subs.length ? undefined : () => history.push(navigation.route),
      children: subs.length ? subs : undefined,
    };
  };

  return (
    <Menu
      mode={isBiggerThanSmallScreen ? 'inline' : 'horizontal'}
      className={styles.sider}
      defaultOpenKeys={isBiggerThanDesktop ? Object.keys(openKeys) : undefined}
      selectedKeys={isBiggerThanDesktop ? [pathname] : undefined}
      key={getMenuKey()}
      overflowedIndicator={isBiggerThanSmallScreen ? undefined : <MenuIcon />}
      items={isBiggerThanSmallScreen ? [
        {
          label: 'For Citizens',
          key: 'citizen',
          children: navigationList.filter(({ isGovt }) => !isBiggerThanSmallScreen || !isGovt).map(createMenu),
        },
        {
          label: 'For State Officials',
          key: 'state',
          children: navigationList.filter(({ isGovt }) => isGovt).map(createMenu),
        },
      ] : navigationList.map(createMenu)}
    />
  );
}

export default UrlMenu;

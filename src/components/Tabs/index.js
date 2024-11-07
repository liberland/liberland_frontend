import React from 'react';
import { NavLink } from 'react-router-dom';

import { useMediaQuery } from 'usehooks-ts';
import RoleHOC from '../../hocs/RoleHOC';

import styles from './styles.module.scss';
// eslint-disable-next-line react/prop-types
function Tabs({ navigationList }) {
  const isTablet = useMediaQuery('(min-width: 768px)');

  return (
    <div className={styles.tabsWrapper}>
      {/* eslint-disable-next-line react/prop-types */}
      {navigationList.map(({
        route, access, title, mobileTitle,
      }) => (
        <RoleHOC key={route} access={access}>
          <NavLink
            to={route}
            activeClassName={styles.activeLink}
            className={styles.link}
          >
            {isTablet ? title : mobileTitle || title}
          </NavLink>
        </RoleHOC>
      ))}
    </div>
  );
}

export default Tabs;

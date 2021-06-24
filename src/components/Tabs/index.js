import React from 'react';
import { NavLink } from 'react-router-dom';

import RoleHOC from '../../hocs/RoleHOC';

import styles from './styles.module.scss';

const Tabs = ({ navigationList }) => (
  <div className={styles.tabsWrapper}>
    {navigationList.map(({ route, access, title }) => (
      <RoleHOC key={route} access={access}>
        <NavLink
          to={route}
          activeClassName={styles.activeLink}
          className={styles.link}
        >
          {title}
        </NavLink>
      </RoleHOC>
    ))}
  </div>
);

export default Tabs;

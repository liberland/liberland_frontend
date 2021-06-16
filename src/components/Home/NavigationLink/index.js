// LIBS
import React from 'react';
import { NavLink } from 'react-router-dom';
import cx from 'classnames';

import styles from './styles.module.scss';

const NavigationLink = ({
  route,
  title,
  icon,
  activeIcon,
  path,
}) => (
  <div className={styles.navigationLink}>
    <NavLink
      to={route}
      activeClassName="active"
      className={cx({ [styles.activeBg]: path === route || path.includes(route) })}
    >
      <img src={icon} alt="" />
      <img src={activeIcon} alt="" className={styles.activeIcon} />
      <span>{title}</span>
      {
        (path === route) && <div />
      }
    </NavLink>
  </div>
);

export default NavigationLink;

// LIBS
import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import cx from 'classnames';

import styles from './styles.module.scss';

const NavigationLink = ({
  route,
  title,
  icon,
  activeIcon,
  path,
  description,
}) => (
  <div className={cx(styles.navigationLink, { [styles.withMargin]: typeof icon === 'function' })}>
    <NavLink
      to={route}
      activeClassName="active"
      className={cx({ [styles.activeBg]: path === route || path.includes(route) })}
    >
      {typeof icon === 'function'
        ? (
          <>
            {icon()}
          </>
        )
        : (
          <>
            <img src={icon} alt="" />
            <img src={activeIcon} alt="" className={styles.activeIcon} />
          </>
        )}
      <div className={cx({ [styles.titleWrapper]: typeof icon === 'function' })}>
        <span>{title}</span>
        {description && <span>{description}</span>}
      </div>
      {
        (path === route) && <div />
      }
    </NavLink>
  </div>
);

NavigationLink.propTypes = {
  route: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  activeIcon: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default NavigationLink;

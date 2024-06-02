// LIBS
import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import cx from 'classnames';
import styles from './styles.module.scss';

function NavigationLink({
  route,
  title,
  icon,
  path,
  description,
  isDiscouraged,
}) {
  return (
    <div
      className={cx(
        styles.navigationLink,
        { [styles.withMargin]: typeof icon === 'function' },
        typeof icon === 'function' && styles.profile,
      )}
      style={{ opacity: (isDiscouraged === true || isDiscouraged === 'true') ? 0.2 : 1 }}
    >
      <NavLink
        to={route === 'logout' ? '#' : route}
        activeClassName="active"
        className={cx(
          { [styles.activeBg]: path === route || path.includes(route) },
          route === 'logout' && styles.logoutBg,
        )}
      >
        <div className={cx(typeof icon !== 'function' && styles.icon)}>
          {typeof icon === 'function'
            ? (
              <>
                {icon()}
              </>
            )
            : (
              <img src={icon} alt="icon" />
            )}
        </div>

        <div className={cx({ [styles.titleWrapper]: typeof icon === 'function' })}>
          <span>{title}</span>
          {description && <span className={cx((typeof icon === 'function') && styles.amount)}>{description}</span>}
        </div>
        {
        (path === route) && <div />
      }
      </NavLink>
    </div>
  );
}

NavigationLink.defaultProps = {
  path: null,
  description: null,
  isDiscouraged: '',
};

NavigationLink.propTypes = {
  route: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  icon: PropTypes.any.isRequired,
  path: PropTypes.string,
  description: PropTypes.string,
  isDiscouraged: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
};

export default NavigationLink;

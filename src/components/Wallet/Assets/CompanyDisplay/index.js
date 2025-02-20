import React from 'react';
import PropTypes from 'prop-types';
import Flex from 'antd/es/flex';
import Link from 'antd/es/typography/Link';
import classNames from 'classnames';
import truncate from '../../../../utils/truncate';
import CompanyImage from '../CompanyImage';
import router from '../../../../router';
import styles from './styles.module.scss';

export default function CompanyDisplay({
  id,
  name,
  logo,
  size,
  showNotConnected,
  hasLink,
}) {
  return (
    <Flex wrap gap="7px" align="center">
      <CompanyImage
        id={id}
        size={size}
        logo={logo}
        name={name}
      />
      <Flex vertical gap="3px">
        {hasLink ? (
          <Link href={router.companies.view.replace(':companyId', id)}>
            {truncate(name || id || 'Unknown', 15)}
          </Link>
        ) : (
          <strong className={styles.value}>
            {truncate(name || id || 'Unknown', 15)}
          </strong>
        )}
        {showNotConnected && (
          <div className={classNames(styles.description, 'description')}>
            Not connected
          </div>
        )}
        <div className={classNames(styles.description, 'description')}>
          ID:
          {' '}
          {id || 'Unknown'}
        </div>
      </Flex>
    </Flex>
  );
}

CompanyDisplay.propTypes = {
  id: PropTypes.oneOfType([
    PropTypes.number.isRequired,
    PropTypes.string.isRequired,
  ]).isRequired,
  name: PropTypes.string,
  logo: PropTypes.string,
  size: PropTypes.number.isRequired,
  showNotConnected: PropTypes.bool,
  hasLink: PropTypes.bool,
};

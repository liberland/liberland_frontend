import React, { useMemo } from 'react';
import Title from 'antd/es/typography/Title';
import { useNavigationList } from '../hooks';
import styles from '../styles.module.scss';

function PageTitle() {
  const { matchedRoute, matchedSubLink } = useNavigationList();
  const pageTitle = useMemo(() => {
    if (matchedSubLink && !matchedSubLink.hideTitle) {
      return matchedSubLink.title;
    }
    if (matchedRoute && !matchedRoute.hideTitle) {
      return matchedRoute.title;
    }
    return '';
  }, [matchedSubLink, matchedRoute]);

  return pageTitle ? (
    <Title level={1} className={styles.pageTitle}>{pageTitle}</Title>
  ) : null;
}

export default PageTitle;

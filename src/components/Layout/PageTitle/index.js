import React, { useMemo } from 'react';
import Title from 'antd/es/typography/Title';
import { useNavigationList } from '../hooks';
import styles from '../styles.module.scss';
import { useHasHiddenTitle } from '../HideTitle';

function PageTitle() {
  const { matchedRoute, matchedSubLink } = useNavigationList();
  const pageTitle = useMemo(() => {
    if (matchedSubLink) {
      return matchedSubLink.title;
    }
    if (matchedRoute) {
      return matchedRoute.title;
    }
    return '';
  }, [matchedSubLink, matchedRoute]);
  const hidden = useHasHiddenTitle();
  return pageTitle && !hidden ? (
    <Title level={1} className={styles.pageTitle}>{pageTitle}</Title>
  ) : null;
}

export default PageTitle;

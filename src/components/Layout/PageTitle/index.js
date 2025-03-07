import React, { useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import Flex from 'antd/es/flex';
import Title from 'antd/es/typography/Title';
import { useNavigationList } from '../hooks';
import { useHasHiddenTitle } from '../HideTitle';
import Button from '../../Button/Button';
import styles from '../styles.module.scss';

function PageTitle() {
  const { matchedRoute, matchedSubLink, pathname } = useNavigationList();
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
  const history = useHistory();
  const extra = Object.entries((matchedSubLink || matchedRoute)?.extra || {}).find(
    ([path]) => path === pathname,
  );
  return (
    <Flex wrap justify="space-between" align="center" className={styles.pageTitleWrapper}>
      {pageTitle && !hidden ? (
        <Title level={1}>{pageTitle}</Title>
      ) : null}
      {extra && (
        <Button primary onClick={() => history.push(extra[1].link)}>
          {extra[1].title}
        </Button>
      )}
    </Flex>
  );
}

export default PageTitle;

import React from 'react';
import PropTypes from 'prop-types';
import styles from './pageHeader.module.scss';

/**
 * The State language's page header.
 *
 * Every screen in the design language opens the same way: a domain eyebrow, a
 * Playfair headline, and an optional lede. Rendering it from the shell rather
 * than inside each feature means the whole application — including the many
 * routes the design never drew — is framed consistently, without touching a
 * single feature component.
 */
function StatePageHeader({ eyebrow, title, lede }) {
  if (!title) return null;
  return (
    <header className={styles.head} data-testid="state-page-header">
      {eyebrow ? <div className={styles.eyebrow}>{eyebrow}</div> : null}
      <h1 className={styles.title}>{title}</h1>
      {lede ? <p className={styles.lede}>{lede}</p> : null}
    </header>
  );
}

StatePageHeader.propTypes = {
  eyebrow: PropTypes.string,
  title: PropTypes.string,
  lede: PropTypes.string,
};

export default StatePageHeader;

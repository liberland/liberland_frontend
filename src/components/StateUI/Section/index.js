import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.module.scss';

/*
 * A section of a State-language screen: a Playfair heading, an optional mono
 * caption beside it, an optional action on the right, then the content.
 *
 * The design language opens every block below the fold this way — "Assets",
 * "Recent transfers", "Validators" — so the heading treatment lives in one
 * place rather than being repeated per screen.
 */
function Section({
  title, caption, action, children,
}) {
  return (
    <section className={styles.section}>
      <div className={styles.head}>
        <h2 className={styles.title}>{title}</h2>
        {caption ? <span className={styles.caption}>{caption}</span> : null}
        {action ? <div className={styles.action}>{action}</div> : null}
      </div>
      {children}
    </section>
  );
}

Section.propTypes = {
  title: PropTypes.string.isRequired,
  caption: PropTypes.node,
  action: PropTypes.node,
  children: PropTypes.node,
};

export default Section;

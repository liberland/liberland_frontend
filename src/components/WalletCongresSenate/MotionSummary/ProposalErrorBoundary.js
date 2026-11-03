import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.module.scss';

/*
 * Keeps one unreadable proposal from taking the whole screen with it.
 *
 * The proposal renderers reach into a call's arguments by position and type.
 * A call shape they were not written for — a new pallet, an old motion, a
 * batch nested one level deeper than expected — throws during render, and
 * because the motions were rendered as one tree that blanked the entire page:
 * every other motion disappeared along with the one at fault.
 *
 * A motion whose body cannot be rendered is still worth showing. Its tally,
 * threshold, deadline and hash are read from the chain's own types and do not
 * depend on understanding the call at all, so they stay on screen and the
 * member can still see the vote and still act on it.
 */
class ProposalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    // Surfaced for whoever is looking at the console; the screen stays up.
    // eslint-disable-next-line no-console
    console.error('Could not render a proposal body', error);
  }

  render() {
    const { failed } = this.state;
    const { children, hash } = this.props;
    if (!failed) return children;
    return (
      <p className={styles.unreadable}>
        This proposal’s contents cannot be displayed by this version of the app.
        {hash ? ' Its hash is shown below; it can be inspected on a block explorer.' : ''}
      </p>
    );
  }
}

ProposalErrorBoundary.propTypes = {
  children: PropTypes.node,
  hash: PropTypes.string,
};

export default ProposalErrorBoundary;

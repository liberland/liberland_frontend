import React from 'react';
import styles from './styles.module.scss';

/*
 * The explanatory material, kept to one line.
 *
 * It used to be four news cards on the landing screen, which is a quarter of
 * the first thing a citizen sees spent on text that answers no question they
 * arrived with — and that ages on its own: the newest of those cards was
 * written in early 2025 and still led the column a year later. The guides
 * themselves are useful; they are one click away rather than in the way.
 */

// Every link is one the app already points at elsewhere, so none of them is
// a guess at a documentation path that may not exist.
const GUIDES = [
  { label: 'Get LLD', href: 'https://docs.liberland.org/blockchain/ecosystem/how-to-acquire-lld' },
  { label: 'Staking', href: 'https://docs.liberland.org/blockchain/for-citizens/staking' },
  { label: 'Bridging', href: 'https://docs.liberland.org/blockchain/cross-chain-bridge' },
  { label: 'Congress', href: 'https://docs.liberland.org/primers/congress' },
  { label: 'Documentation', href: 'https://docs.liberland.org' },
];

export default function Guides() {
  return (
    <nav className={styles.guides} aria-label="Guides">
      <span className={styles.label}>Guides</span>
      {GUIDES.map(({ label, href }) => (
        <a
          key={label}
          className={styles.link}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
        >
          {label}
        </a>
      ))}
    </nav>
  );
}

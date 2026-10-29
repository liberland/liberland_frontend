import React from 'react';
import Button from '../../Button/Button';
import Section from '../../StateUI/Section';
import {
  BRIDGE_DOCS, HASHI_BRIDGE, INTRO, LLD_XOR_SWAP, PREREQUISITES, SOLANA_DOCS,
  SOLANA_NOTE, STEPS, TWO_HOPS, WARNINGS,
} from './content';
import styles from './state.module.scss';

/*
 * The bridge instructions in the Liberland State design language: a lede under
 * a state-yellow rule, the steps as a numbered sequence of hairline blocks, and
 * the warnings set apart. Same content as the Ledger page, from the same file.
 */
export default function StateBridge() {
  return (
    <div className={styles.page}>
      <div className={styles.lede}>
        <p className={styles.intro}>{INTRO}</p>
        <p className={styles.intro}>{TWO_HOPS}</p>
        <div className={styles.actions}>
          <Button primary href={HASHI_BRIDGE} onClick={() => window.open(HASHI_BRIDGE)}>
            Open HASHI bridge
          </Button>
          <Button href={LLD_XOR_SWAP} onClick={() => window.open(LLD_XOR_SWAP)}>
            Swap LLD for XOR
          </Button>
          <Button href={BRIDGE_DOCS} onClick={() => window.open(BRIDGE_DOCS)}>
            Full guide
          </Button>
        </div>
      </div>

      <Section title="Before you start">
        <ul className={styles.list}>
          {PREREQUISITES.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </Section>

      <Section title="The route">
        <ol className={styles.steps}>
          {STEPS.map((step, index) => (
            <li key={step.title} className={styles.step}>
              <span className={styles.stepNumber}>{String(index + 1).padStart(2, '0')}</span>
              <div className={styles.stepBody}>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <ul className={styles.list}>
                  {step.body.map((line) => <li key={line}>{line}</li>)}
                </ul>
                {step.note ? <p className={styles.note}>{step.note}</p> : null}
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <aside className={styles.warning}>
        <div className={styles.warningLabel}>Use the official bridge only</div>
        <ul className={styles.list}>
          {WARNINGS.map((line) => <li key={line}>{line}</li>)}
        </ul>
      </aside>

      <Section title="Solana">
        <p className={styles.note}>
          {SOLANA_NOTE}
        </p>
        <div className={styles.actions}>
          <Button href={SOLANA_DOCS} onClick={() => window.open(SOLANA_DOCS)}>
            Read the Solana guide
          </Button>
        </div>
      </Section>
    </div>
  );
}
